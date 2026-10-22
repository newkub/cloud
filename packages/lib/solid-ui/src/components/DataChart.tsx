/**
 * DataChart component — full-featured chart powered by @wrikka/chart.
 * Supports all 28 chart types (line, bar, pie, gauge, boxplot, candlestick, histogram,
 * streamgraph, gantt, chord, word-cloud, …). Full library docs: /chart
 */
import { Chart } from "@wrikka/chart/solid";
import { type ComponentProps, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DataChartProps extends ComponentProps<typeof Chart> {
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DataChart(props: DataChartProps) {
	const [local, rest] = splitProps(props, ["className", "radius", "elevation"]);
	const cls = () =>
		[
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.className ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<Show
			when={(rest.data?.datasets?.length ?? 0) > 0}
			fallback={<div class={`p-4 text-xs text-muted-foreground ${cls()}`}>No data</div>}
		>
			<Chart {...rest} data={rest.data ?? { labels: [], datasets: [] }} className={cls()} />
		</Show>
	);
}
