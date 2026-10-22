/**
 * SortSelect - compact sort dropdown for list/table toolbars.
 */
import { For, type JSX, splitProps } from "solid-js";
import { Select } from "./Select";

export interface SortOption {
	/** Option id passed to onChange. */
	id: string;
	/** Display label. */
	label: string;
}

export interface SortSelectProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Sortable fields. */
	options: SortOption[];
	/** Active sort id. */
	value?: string;
	/** Called with the picked sort id. */
	onChange?: (id: string) => void;
	/** Prefix label inside the control. @default "Sort:" */
	prefix?: string;
	/** Accessible label. @default "Sort order" */
	label?: string;
}

export function SortSelect(props: SortSelectProps) {
	const [local, rest] = splitProps(props, ["class", "options", "value", "onChange", "prefix", "label"]);

	const className = () =>
		["solidui-sort-select inline-flex items-center gap-1.5", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div class={className()} {...rest}>
			<span class="text-xs text-muted-foreground whitespace-nowrap">{local.prefix ?? "Sort:"}</span>
			<Select
				class="h-8 w-auto min-w-[8rem]"
				aria-label={local.label ?? "Sort order"}
				value={local.value}
				onChange={(v) => local.onChange?.(v)}
			>
				<For each={local.options}>{(o) => <option value={o.id}>{o.label}</option>}</For>
			</Select>
		</div>
	);
}
