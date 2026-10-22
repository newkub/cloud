/**
 * ChecklistTable - table where the first column is a checkbox.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap, type SurfaceVariant } from "../lib/variants";

export interface ChecklistTableItem {
	/** Primary text */
	label: string;
	/** Secondary text */
	description?: string;
	/** Leading icon */
	icon?: JSX.Element;
	/** Trailing badge text/count */
	badge?: string | number;
	/** Right-aligned meta text */
	meta?: string;
	/** Item link — renders an anchor */
	href?: string;
	/** Disabled state */
	disabled?: boolean;
	/** Click handler */
	onSelect?: (item: ChecklistTableItem) => void;
}

export interface ChecklistTableProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Row items */
	items?: ChecklistTableItem[];
	/** Called when a row is clicked */
	onSelect?: (item: ChecklistTableItem) => void;
	/** Rendered when items is empty */
	empty?: JSX.Element;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Checked labels */
	checked?: string[];
	/** Called with checked labels */
	onCheckChange?: (checked: string[]) => void;
}

export function ChecklistTable(props: ChecklistTableProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"onSelect",
		"empty",
		"variant",
		"size",
		"radius",
		"elevation",
		"checked",
		"onCheckChange",
	]);
	const rowPad = () =>
		({ sm: "px-2 py-1 text-xs", md: "px-3 py-2 text-sm", lg: "px-4 py-2.5 text-sm" })[local.size ?? "md"];
	return (
		<div
			class={`solidui-checklist-table overflow-hidden border border-border ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={(local.items ?? []).length === 0}>{local.empty}</Show>
			<For each={local.items}>
				{(item, i) => (
					<button
						type="button"
						disabled={item.disabled}
						class={`flex w-full items-center justify-between gap-4 border-b border-border text-left last:border-0 disabled:opacity-50 ${rowPad()} ${i() % 2 ? "bg-muted/30" : "bg-surface"}`}
						onClick={() => {
							item.onSelect?.(item);
							local.onSelect?.(item);
						}}
					>
						<span class="flex shrink-0 items-center gap-1.5 font-medium text-muted-foreground">
							{item.icon}
							{item.label}
						</span>
						<span class="min-w-0 truncate text-right text-foreground">
							{item.description ?? item.meta ?? item.badge}
						</span>
					</button>
				)}
			</For>
		</div>
	);
}
