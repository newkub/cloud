/**
 * Histogram — Binned distribution histogram powered by @wrikka/chart.
 * Full library docs: /chart
 */
import { Chart } from "@wrikka/chart/solid";
import { type ComponentProps, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface HistogramProps extends Omit<ComponentProps<typeof Chart>, "type"> {
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Histogram(props: HistogramProps) {
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
			<Chart {...rest} data={rest.data ?? { labels: [], datasets: [] }} className={cls()} type="histogram" />
		</Show>
	);
}
