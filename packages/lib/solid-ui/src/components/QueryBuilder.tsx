/**
 * QueryBuilder — visual filter rows (field / operator / value) that emit a query array.
 * Supports one level of groups with and/or combinators via `groupable`.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { ALL_OPS, ctrl, OP_LABEL } from "./query-builder/constants";
import { gridIcon, plusIcon } from "./query-builder/icons";
import { QueryGroupBox } from "./query-builder/QueryGroupBox";
import { QueryRuleRow } from "./query-builder/QueryRuleRow";
import {
	isQueryGroup,
	type QueryBuilderLabels,
	type QueryCombinator,
	type QueryField,
	type QueryNode,
	type QueryOperator,
	type QueryRule,
} from "./query-builder/types";

export type {
	QueryBuilderLabels,
	QueryCombinator,
	QueryField,
	QueryGroup,
	QueryNode,
	QueryOperator,
	QueryRule,
} from "./query-builder/types";
export { isQueryGroup } from "./query-builder/types";

export interface QueryBuilderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	fields: QueryField[];
	rules: QueryNode[];
	onChange?: (rules: QueryNode[]) => void;
	/** Allowed operators for all fields — field-level `operators` still wins. */
	operators?: QueryOperator[];
	/** Display text per operator. */
	operatorLabels?: Partial<Record<QueryOperator, string>>;
	/** Allow nested groups joined by their own and/or combinator. @default false */
	groupable?: boolean;
	/** Show a per-rule button that clears the value. @default false */
	clearable?: boolean;
	/** Limit the top-level node count. */
	maxRules?: number;
	/** Labels for UI text. */
	labels?: QueryBuilderLabels;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	disabled?: boolean;
}

export function QueryBuilder(props: QueryBuilderProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"fields",
		"rules",
		"onChange",
		"operators",
		"operatorLabels",
		"groupable",
		"clearable",
		"maxRules",
		"labels",
		"size",
		"variant",
		"radius",
		"elevation",
		"disabled",
	]);
	const size = () => local.size ?? "md";
	const fields = () => local.fields ?? [];
	const nodes = () => local.rules ?? [];
	const ops = (field: string) => fields().find((f) => f.key === field)?.operators ?? local.operators ?? ALL_OPS;
	const opLabel = (op: QueryOperator) => local.operatorLabels?.[op] ?? OP_LABEL[op];
	const l = (): Required<QueryBuilderLabels> => ({
		addRule: "Add filter",
		addGroup: "Add group",
		removeRule: "Remove rule",
		removeGroup: "Remove group",
		clearValue: "Clear value",
		clearAll: "Clear all",
		empty: "No filters — add one to narrow results.",
		conjunction: "AND",
		where: "WHERE",
		...local.labels,
	});

	const inputCls = `rounded-md border border-border bg-surface px-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${ctrl[size()]}`;
	const iconBtn =
		"flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground motion-safe:transition-colors motion-reduce:transition-none hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";
	const addBtn = `mt-2 inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2.5 font-medium text-muted-foreground motion-safe:transition-colors motion-reduce:transition-none hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${ctrl[size()]}`;

	const newRule = (): QueryRule => {
		const f = fields()[0];
		return { field: f?.key ?? "", operator: ops(f?.key ?? "")[0] ?? "eq", value: "" };
	};

	// -- node mutations -------------------------------------------------------
	const emit = (next: QueryNode[]) => local.onChange?.(next);
	const updateRule = (path: [number, number?], patch: Partial<QueryRule>) => {
		const [ni, ri] = path;
		emit(
			nodes().map((n, i) => {
				if (i !== ni) return n;
				if (ri === undefined) return isQueryGroup(n) ? n : { ...n, ...patch };
				if (!isQueryGroup(n)) return n;
				return { ...n, rules: n.rules.map((r, j) => (j === ri ? { ...r, ...patch } : r)) };
			}),
		);
	};
	const addRule = (gi?: number) => {
		if (gi === undefined) {
			emit([...nodes(), newRule()]);
			return;
		}
		emit(nodes().map((n, i) => (i === gi && isQueryGroup(n) ? { ...n, rules: [...n.rules, newRule()] } : n)));
	};
	const addGroup = () => emit([...nodes(), { combinator: "and", rules: [newRule()] }]);
	const removeNode = (ni: number) => emit(nodes().filter((_, i) => i !== ni));
	const removeRule = (gi: number, ri: number) =>
		emit(
			nodes().map((n, i) => (i === gi && isQueryGroup(n) ? { ...n, rules: n.rules.filter((_, j) => j !== ri) } : n)),
		);
	const setCombinator = (gi: number, combinator: QueryCombinator) =>
		emit(nodes().map((n, i) => (i === gi && isQueryGroup(n) ? { ...n, combinator } : n)));

	// -- row renderer ---------------------------------------------------------
	const ruleRow = (rule: QueryRule, path: [number, number?], tag: string, onRemove: () => void) => (
		<QueryRuleRow
			rule={rule}
			tag={tag}
			disabled={local.disabled}
			fields={fields()}
			operators={ops(rule.field)}
			opLabel={opLabel}
			inputCls={inputCls}
			iconBtnCls={iconBtn}
			clearable={local.clearable}
			clearValueLabel={l().clearValue}
			removeRuleLabel={l().removeRule}
			onUpdate={(patch) => updateRule(path, patch)}
			onRemove={onRemove}
		/>
	);

	const atMax = () => local.maxRules !== undefined && nodes().length >= local.maxRules;

	return (
		<div
			class={`solidui-query-builder ${surfaceVariants[local.variant ?? "default"]} p-3 ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show
				when={nodes().length}
				fallback={<div class="py-4 text-center text-xs text-muted-foreground">{l().empty}</div>}
			>
				<div class="space-y-2">
					<For each={nodes()}>
						{(node, i) => (
							<Show
								when={isQueryGroup(node) ? node : undefined}
								fallback={ruleRow(node as QueryRule, [i()], i() === 0 ? l().where : l().conjunction, () =>
									removeNode(i()),
								)}
							>
								{(group) => (
									<QueryGroupBox
										group={group()}
										tag={i() === 0 ? l().where : l().conjunction}
										disabled={local.disabled}
										inputCls={inputCls}
										iconBtnCls={iconBtn}
										radiusCls={radiusMap[local.radius ?? "md"]}
										removeGroupLabel={l().removeGroup}
										addRuleLabel={l().addRule}
										renderRule={(r, ri, tag) => ruleRow(r, [i(), ri], tag, () => removeRule(i(), ri))}
										onSetCombinator={(c) => setCombinator(i(), c)}
										onRemove={() => removeNode(i())}
										onAddRule={() => addRule(i())}
									/>
								)}
							</Show>
						)}
					</For>
				</div>
			</Show>
			<div class="flex flex-wrap items-center gap-2">
				<button type="button" disabled={local.disabled || atMax()} class={addBtn} onClick={() => addRule()}>
					{plusIcon}
					{l().addRule}
				</button>
				<Show when={local.groupable}>
					<button type="button" disabled={local.disabled || atMax()} class={addBtn} onClick={addGroup}>
						{gridIcon}
						{l().addGroup}
					</button>
				</Show>
				<Show when={local.clearable && nodes().length}>
					<button type="button" disabled={local.disabled} class={addBtn} onClick={() => emit([])}>
						{l().clearAll}
					</button>
				</Show>
			</div>
		</div>
	);
}
