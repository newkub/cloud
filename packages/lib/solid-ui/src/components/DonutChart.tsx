/**
 * DonutChart — donut/pie chart with optional center value and legend.
 * @deprecated Use `PieChart` with `innerRadius` — same slices plus
 * `centerValue`/`centerLabel` support.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { CHART_PALETTE, PieChart } from "./PieChart";

export { CHART_PALETTE };

export interface DonutChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Segment values — numbers (labels pulled from `labels`) or {label,value} slices. */
	segments: (number | { label: string; value: number; color?: string })[];
	labels?: string[];
	/** Hole size as a fraction of the radius (0 = pie). @default 0.6 */
	innerRadius?: number;
	/** Big text in the hole — e.g. "72%". */
	centerValue?: string;
	/** Small caption under `centerValue`. */
	centerLabel?: string;
	/** Show the legend to the right. @default true */
	legend?: boolean;
	/** Pixel size of the donut. @default 120 */
	size?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DonutChart(props: DonutChartProps) {
	const [local, rest] = splitProps(props, [
		"segments",
		"labels",
		"innerRadius",
		"centerValue",
		"centerLabel",
		"legend",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<PieChart
			data={(local.segments ?? []).map((s, i) =>
				typeof s === "number" ? { value: s, label: local.labels?.[i] ?? `Slice ${i + 1}` } : s,
			)}
			label="Donut chart"
			innerRadius={local.innerRadius ?? 0.6}
			centerValue={local.centerValue}
			centerLabel={local.centerLabel}
			showLegend={local.legend ?? true}
			size={local.size}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		/>
	);
}
