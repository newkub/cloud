/**
 * GaugeChart component — canvas radial gauge powered by @wrikka/chart.
 * Full library docs: /chart
 */
import { GaugeChart as ChartGauge } from "@wrikka/chart/solid";
import { type ComponentProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface GaugeChartProps extends ComponentProps<typeof ChartGauge> {
	/** Class applied to the wrapping container. */
	className?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function GaugeChart(props: GaugeChartProps) {
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
		<div class={cls()}>
			<ChartGauge {...rest} />
		</div>
	);
}
