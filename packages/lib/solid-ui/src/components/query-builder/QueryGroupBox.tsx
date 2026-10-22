import { For, type JSX } from "solid-js";
import { removeIcon } from "./icons";
import type { QueryCombinator, QueryGroup, QueryRule } from "./types";

export interface QueryGroupBoxProps {
	group: QueryGroup;
	/** Leading tag: WHERE / conjunction. */
	tag: string;
	disabled?: boolean;
	inputCls: string;
	iconBtnCls: string;
	radiusCls: string;
	removeGroupLabel: string;
	addRuleLabel: string;
	/** Renders one rule row; tag is "…" for the first row, the combinator after. */
	renderRule: (rule: QueryRule, index: number, tag: string) => JSX.Element;
	onSetCombinator: (combinator: QueryCombinator) => void;
	onRemove: () => void;
	onAddRule: () => void;
}

/** A combinator-headed box wrapping one level of nested rules. */
export function QueryGroupBox(props: QueryGroupBoxProps) {
	return (
		<div class={`rounded-md border border-border/60 bg-muted/20 p-2 ${props.radiusCls}`}>
			<div class="mb-1.5 flex items-center gap-2">
				<span class="w-8 text-center font-mono text-2xs text-muted-foreground">{props.tag}</span>
				<select
					class={`${props.inputCls} w-20 uppercase`}
					disabled={props.disabled}
					aria-label="Group combinator"
					value={props.group.combinator}
					onChange={(e) => props.onSetCombinator(e.currentTarget.value as QueryCombinator)}
				>
					<option value="and">AND</option>
					<option value="or">OR</option>
				</select>
				<button
					type="button"
					disabled={props.disabled}
					aria-label={props.removeGroupLabel}
					class={`${props.iconBtnCls} ml-auto`}
					onClick={props.onRemove}
				>
					{removeIcon}
				</button>
			</div>
			<div class="space-y-1.5 pl-2">
				<For each={props.group.rules}>
					{(r, ri) => props.renderRule(r, ri(), ri() === 0 ? "…" : props.group.combinator.toUpperCase())}
				</For>
			</div>
			<button
				type="button"
				disabled={props.disabled}
				class="mt-1.5 ml-10 inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2 text-2xs font-medium text-muted-foreground motion-safe:transition-colors motion-reduce:transition-none hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
				onClick={props.onAddRule}
			>
				+ {props.addRuleLabel}
			</button>
		</div>
	);
}
