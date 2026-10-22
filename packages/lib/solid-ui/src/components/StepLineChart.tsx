/**
 * StepLineChart — line chart with step interpolation; good for discrete changes (prices, tiers).
 * @deprecated Use `LineChart` with `curve="step-before" | "step-after" | "step-middle"` —
 * it also supports multi-series, grid, dots and legend.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { LineChart } from "./LineChart";

export interface StepLineChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: number[];
	labels?: string[];
	/** Step position. @default "after" */
	step?: "before" | "after" | "middle";
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function StepLineChart(props: StepLineChartProps) {
	const [local, rest] = splitProps(props, ["data", "labels", "step", "width", "height", "radius", "elevation"]);
	return (
		<LineChart
			data={local.data}
			labels={local.labels}
			curve={`step-${local.step ?? "after"}`}
			width={local.width ?? 400}
			height={local.height ?? 160}
			showDots={false}
			showGrid={false}
			showLegend={false}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		/>
	);
}
