/**
 * AnomalyChart - line chart flagging anomalous points.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface AnomalyChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Series values */
	data?: number[];
	/** Category labels */
	labels?: string[];
	/** Accessible svg label */
	label?: string;
	/** Chart width px @default 400 */
	width?: number;
	/** Chart height px @default 160 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Indices flagged anomalous */
	anomalies?: number[];
}

export function AnomalyChart(props: AnomalyChartProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"labels",
		"label",
		"width",
		"height",
		"radius",
		"elevation",
		"children",
		"anomalies",
	]);
	const vals = () => local.data ?? [];
	const w = () => local.width ?? 400;
	const h = () => local.height ?? 160;
	const min = () => Math.min(...vals());
	const max = () => Math.max(...vals());
	const pts = () => {
		const range = max() - min() || 1;
		const step = vals().length > 1 ? w() / (vals().length - 1) : w();
		return vals()
			.map((v, i) => `${(i * step).toFixed(1)},${(h() - 8 - ((v - min()) / range) * (h() - 16)).toFixed(1)}`)
			.join(" ");
	};
	return (
		<div
			class={`solidui-anomaly-chart inline-flex flex-col gap-2 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={w()}
				height={h()}
				viewBox={`0 0 ${w()} ${h()}`}
				role="img"
				aria-label={local.label ?? "AnomalyChart chart"}
			>
				<polyline
					points={pts()}
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="text-primary"
					stroke-linejoin="round"
					stroke-linecap="round"
				/>
			</svg>
			{local.children}
		</div>
	);
}
