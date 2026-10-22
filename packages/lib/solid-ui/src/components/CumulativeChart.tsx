/**
 * CumulativeChart — running-total area chart (S-curve for totals over time).
 */
import { type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CumulativeChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: number[];
	labels?: string[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function CumulativeChart(props: CumulativeChartProps) {
	const merged = mergeProps({ width: 400, height: 160 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"labels",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const path = () => {
		const data = local.data ?? [];
		if (!data.length) return { area: "", line: "", total: 0 };
		let run = 0;
		const cum = data.map((v) => (run += v));
		const total = cum[cum.length - 1] || 1;
		const pad = 8;
		const base = local.height - 20;
		const step = (local.width - pad * 2) / Math.max(1, data.length - 1);
		const pts = cum.map((v, i) => `${(pad + i * step).toFixed(1)},${(base - (v / total) * (base - 12)).toFixed(1)}`);
		return {
			line: `M${pts.join(" L")}`,
			area: `M${pad},${base} L${pts.join(" L")} L${local.width - pad},${base} Z`,
			total: cum[cum.length - 1],
		};
	};

	return (
		<div
			class={[
				"w-full text-primary",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="h-40 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Cumulative chart">
				<path d={path().area} fill="currentColor" opacity="0.15" />
				<path d={path().line} fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
				<text x={local.width - 10} y={16} text-anchor="end" font-size="9" class="fill-muted-foreground tabular-nums">
					Σ {path().total}
				</text>
			</svg>
			{local.children}
		</div>
	);
}
