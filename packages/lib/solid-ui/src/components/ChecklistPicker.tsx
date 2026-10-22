/**
 * ChecklistPicker - checklist where each row is a checkbox.
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

export interface ChecklistPickerItem {
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
	onSelect?: (item: ChecklistPickerItem) => void;
}

export interface ChecklistPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Row items */
	items?: ChecklistPickerItem[];
	/** Called when a row is clicked */
	onSelect?: (item: ChecklistPickerItem) => void;
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
	value?: string[];
	/** Called with checked labels */
	onCheckChange?: (checked: string[]) => void;
}

export function ChecklistPicker(props: ChecklistPickerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"onSelect",
		"empty",
		"variant",
		"size",
		"radius",
		"elevation",
		"value",
		"onCheckChange",
	]);
	const padCls = () => ({ sm: "py-1.5 text-xs", md: "py-2 text-sm", lg: "py-3 text-sm" })[local.size ?? "md"];
	return (
		<div
			class={`solidui-checklist-picker divide-y divide-border ${local.variant ? surfaceVariants[local.variant] : ""} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={(local.items ?? []).length === 0}>{local.empty}</Show>
			<For each={local.items}>
				{(item) => (
					<button
						type="button"
						disabled={item.disabled}
						class={`flex w-full items-center gap-3 text-left ${padCls()} ${item.onSelect || item.href || local.onSelect ? "hover:bg-muted/50" : ""} disabled:opacity-50`}
						onClick={() => {
							item.onSelect?.(item);
							local.onSelect?.(item);
						}}
					>
						<Show when={item.icon}>
							<span class="shrink-0 text-muted-foreground" aria-hidden="true">
								{item.icon}
							</span>
						</Show>
						<div class="min-w-0 flex-1">
							<div class="font-medium text-foreground">{item.label}</div>
							<Show when={item.description}>
								<div class="truncate text-xs text-muted-foreground">{item.description}</div>
							</Show>
						</div>
						<Show when={item.badge !== undefined}>
							<span class="rounded-full bg-muted px-1.5 py-0.5 text-2xs text-muted-foreground">{item.badge}</span>
						</Show>
						<Show when={item.meta}>
							<span class="shrink-0 text-xs tabular-nums text-muted-foreground">{item.meta}</span>
						</Show>
					</button>
				)}
			</For>
		</div>
	);
}
