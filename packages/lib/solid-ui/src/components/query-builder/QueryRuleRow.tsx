import { For, Show } from "solid-js";
import { removeIcon } from "./icons";
import type { QueryField, QueryOperator, QueryRule } from "./types";

export interface QueryRuleRowProps {
	rule: QueryRule;
	/** Leading tag: WHERE / conjunction / "…". */
	tag: string;
	disabled?: boolean;
	fields: QueryField[];
	operators: QueryOperator[];
	opLabel: (op: QueryOperator) => string;
	inputCls: string;
	iconBtnCls: string;
	clearable?: boolean;
	clearValueLabel: string;
	removeRuleLabel: string;
	onUpdate: (patch: Partial<QueryRule>) => void;
	onRemove: () => void;
}

/** Single field/operator/value row inside QueryBuilder. */
export function QueryRuleRow(props: QueryRuleRowProps) {
	const field = () => props.fields.find((f) => f.key === props.rule.field);
	return (
		<div class="flex flex-wrap items-center gap-2">
			<span class={`w-8 text-center font-mono text-2xs text-muted-foreground`}>{props.tag}</span>
			<select
				class={props.inputCls}
				disabled={props.disabled}
				aria-label="Field"
				value={props.rule.field}
				onChange={(e) => props.onUpdate({ field: e.currentTarget.value })}
			>
				<For each={props.fields}>{(f) => <option value={f.key}>{f.label}</option>}</For>
			</select>
			<select
				class={props.inputCls}
				disabled={props.disabled}
				aria-label="Operator"
				value={props.rule.operator}
				onChange={(e) => props.onUpdate({ operator: e.currentTarget.value as QueryOperator })}
			>
				<For each={props.operators}>{(op) => <option value={op}>{props.opLabel(op)}</option>}</For>
			</select>
			<Show
				when={field()?.type === "select"}
				fallback={
					<input
						class={`${props.inputCls} min-w-24 flex-1`}
						type={field()?.type === "number" ? "number" : "text"}
						disabled={props.disabled}
						value={props.rule.value}
						placeholder="value"
						aria-label="Value"
						onInput={(e) => props.onUpdate({ value: e.currentTarget.value })}
					/>
				}
			>
				<select
					class={`${props.inputCls} min-w-24 flex-1`}
					disabled={props.disabled}
					aria-label="Value"
					value={props.rule.value}
					onChange={(e) => props.onUpdate({ value: e.currentTarget.value })}
				>
					<For each={field()?.options ?? []}>{(o) => <option value={o.value}>{o.label}</option>}</For>
				</select>
			</Show>
			<Show when={props.clearable && props.rule.value}>
				<button
					type="button"
					disabled={props.disabled}
					aria-label={props.clearValueLabel}
					title={props.clearValueLabel}
					class={`${props.iconBtnCls} h-6 w-6 hover:bg-muted hover:text-foreground`}
					onClick={() => props.onUpdate({ value: "" })}
				>
					{removeIcon}
				</button>
			</Show>
			<button
				type="button"
				disabled={props.disabled}
				aria-label={props.removeRuleLabel}
				class={props.iconBtnCls}
				onClick={props.onRemove}
			>
				{removeIcon}
			</button>
		</div>
	);
}
