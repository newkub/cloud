/**
 * ChartLegend — color-swatch legend list with optional interactive toggling.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { CHART_PALETTE } from "./DonutChart";

export interface ChartLegendItem {
	/** Item label */
	label: string;
	/** Swatch color — CSS color; defaults cycle the theme palette */
	color?: string;
	/** Optional value shown next to the label */
	value?: string | number;
}

export interface ChartLegendProps extends Omit<JSX.HTMLAttributes<HTMLUListElement>, "onToggle"> {
	/** Legend entries */
	items: ChartLegendItem[];
	/** Layout direction @default "horizontal" */
	orientation?: "horizontal" | "vertical";
	/** Click to toggle items on/off @default false */
	interactive?: boolean;
	/** Called with the item and its new enabled state */
	onToggle?: (item: ChartLegendItem, enabled: boolean) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ChartLegend(props: ChartLegendProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"orientation",
		"interactive",
		"onToggle",
		"radius",
		"elevation",
	]);
	const [off, setOff] = createSignal<ReadonlySet<number>>(new Set());
	const toggle = (item: ChartLegendItem, i: number) => {
		const next = new Set(off());
		if (next.has(i)) {
			next.delete(i);
		} else {
			next.add(i);
		}
		setOff(next);
		local.onToggle?.(item, !next.has(i));
	};
	const inner = (item: ChartLegendItem, i: () => number) => (
		<>
			<span
				class="h-2.5 w-2.5 shrink-0 rounded-sm"
				style={{ "background-color": item.color ?? CHART_PALETTE[i() % CHART_PALETTE.length] }}
			/>
			<span class="text-muted-foreground">{item.label}</span>
			<Show when={item.value !== undefined}>
				<span class="font-medium tabular-nums">{item.value}</span>
			</Show>
		</>
	);
	return (
		<ul
			class={`solidui-chart-legend ${
				(local.orientation ?? "horizontal") === "vertical"
					? "flex flex-col gap-1"
					: "flex flex-wrap items-center gap-x-3 gap-y-1"
			} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.items ?? []}>
				{(item, i) => (
					<li class="text-xs">
						<Show
							when={local.interactive}
							fallback={
								<span class={`flex items-center gap-1.5 ${off().has(i()) ? "opacity-40" : ""}`}>{inner(item, i)}</span>
							}
						>
							<button
								type="button"
								class={`flex items-center gap-1.5 transition-opacity motion-reduce:transition-none ${off().has(i()) ? "opacity-40" : ""}`}
								aria-pressed={!off().has(i())}
								onClick={() => toggle(item, i())}
							>
								{inner(item, i)}
							</button>
						</Show>
					</li>
				)}
			</For>
		</ul>
	);
}
