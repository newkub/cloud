/**
 * MasterDetail — list pane + detail pane layout with selectable rows.
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

export interface MasterItem {
	key: string;
	label: string;
	/** Secondary text under the label. */
	description?: string;
	/** Leading icon/avatar slot. */
	icon?: JSX.Element;
	/** Trailing slot (badge, time). */
	trailing?: JSX.Element;
	disabled?: boolean;
}

export interface MasterDetailProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	items: MasterItem[];
	/** Selected item key. */
	selected?: string;
	onSelect?: (item: MasterItem) => void;
	/** Detail pane content — receives selected item. */
	renderDetail?: (item: MasterItem) => JSX.Element;
	/** List width ratio 0–1. @default 0.35 */
	ratio?: number;
	/** Empty detail placeholder. */
	emptyDetail?: JSX.Element;
	/** List pane title. */
	title?: string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const rowPad = { sm: "px-2.5 py-1.5", md: "px-3 py-2", lg: "px-4 py-2.5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function MasterDetail(props: MasterDetailProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"selected",
		"onSelect",
		"renderDetail",
		"ratio",
		"emptyDetail",
		"title",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const current = () => (local.items ?? []).find((i) => i.key === local.selected);
	return (
		<div
			class={`solidui-master-detail flex flex-col overflow-hidden sm:flex-row ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div
				class="min-w-0 w-full border-b border-border sm:w-[var(--mdw)] sm:border-b-0 sm:border-r"
				style={{ "--mdw": `${(local.ratio ?? 0.35) * 100}%` }}
			>
				<Show when={local.title}>
					<div
						class={`border-b border-border font-semibold text-foreground ${rowPad[local.size ?? "md"]} ${local.size === "lg" ? "text-base" : "text-sm"}`}
					>
						{local.title}
					</div>
				</Show>
				<ul class="max-h-96 overflow-y-auto">
					<For each={local.items ?? []}>
						{(item) => (
							<li>
								<button
									type="button"
									disabled={item.disabled}
									aria-current={local.selected === item.key}
									class={`flex w-full items-center gap-2 text-left motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-50 ${rowPad[local.size ?? "md"]} ${textSize[local.size ?? "md"]} ${
										local.selected === item.key ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
									}`}
									onClick={() => local.onSelect?.(item)}
								>
									{item.icon}
									<span class="min-w-0 flex-1">
										<span class="block truncate font-medium">{item.label}</span>
										<Show when={item.description}>
											<span class="block truncate text-2xs text-muted-foreground">{item.description}</span>
										</Show>
									</span>
									{item.trailing}
								</button>
							</li>
						)}
					</For>
				</ul>
			</div>
			<div class="min-w-0 flex-1 p-4">
				<Show
					when={current()}
					fallback={
						local.emptyDetail ?? (
							<div class="flex h-full items-center justify-center text-xs text-muted-foreground">Select an item</div>
						)
					}
				>
					{(item) =>
						local.renderDetail ? local.renderDetail(item()) : <div class="text-sm text-foreground">{item().label}</div>
					}
				</Show>
			</div>
		</div>
	);
}
