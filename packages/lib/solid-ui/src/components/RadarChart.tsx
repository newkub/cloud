/**
 * RadarChart — SVG radar/spider chart for multi-axis values.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { CHART_PALETTE } from "./DonutChart";

export interface RadarSeries {
	/** Series name (legend) */
	name: string;
	/** Values aligned with `axes` */
	values: number[];
	color?: string;
}

export interface RadarChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Axis labels around the chart */
	axes: string[];
	series: RadarSeries[];
	/** Axis maximum @default 100 */
	max?: number;
	/** Show legend @default true */
	legend?: boolean;
	/** Chart size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const px = { sm: 160, md: 220, lg: 280 } as const;
const CX = 50;
const CY = 50;
const R = 38;

export function RadarChart(props: RadarChartProps) {
	const [local, rest] = splitProps(props, ["class", "axes", "series", "max", "legend", "size", "radius", "elevation"]);
	const axes = () => local.axes ?? [];
	const series = () => local.series ?? [];
	const n = () => axes().length;
	const angle = (i: number) => (i / n()) * Math.PI * 2 - Math.PI / 2;
	const point = (i: number, frac: number) => ({
		x: CX + R * frac * Math.cos(angle(i)),
		y: CY + R * frac * Math.sin(angle(i)),
	});
	const ringPoints = (frac: number) =>
		axes()
			.map((_, i) => `${point(i, frac).x},${point(i, frac).y}`)
			.join(" ");
	const seriesPoints = (s: RadarSeries) =>
		axes()
			.map((_, i) => {
				const f = Math.min(1, (s.values[i] ?? 0) / (local.max ?? 100));
				return `${point(i, f).x},${point(i, f).y}`;
			})
			.join(" ");
	return (
		<div
			class={`solidui-radar-chart inline-flex flex-col items-center gap-2 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={px[local.size ?? "md"]}
				height={px[local.size ?? "md"]}
				viewBox="0 0 100 100"
				role="img"
				class="max-w-full"
				aria-label={`Radar chart: ${series()
					.map((s) => s.name)
					.join(", ")} across ${axes().join(", ")}`}
			>
				<For each={[0.33, 0.66, 1]}>
					{(f) => <polygon points={ringPoints(f)} fill="none" class="stroke-border" stroke-width="0.5" />}
				</For>
				<For each={axes()}>
					{(axis, i) => (
						<g>
							<line
								x1={CX}
								y1={CY}
								x2={point(i(), 1).x}
								y2={point(i(), 1).y}
								class="stroke-border"
								stroke-width="0.5"
							/>
							<text
								x={point(i(), 1.18).x}
								y={point(i(), 1.18).y}
								text-anchor="middle"
								dy="0.3em"
								class="fill-muted-foreground"
								font-size="6"
							>
								{axis}
							</text>
						</g>
					)}
				</For>
				<For each={series()}>
					{(s, i) => {
						const color = () => s.color ?? CHART_PALETTE[i() % CHART_PALETTE.length];
						return (
							<polygon
								points={seriesPoints(s)}
								fill={color()}
								fill-opacity="0.15"
								stroke={color()}
								stroke-width="1.5"
							/>
						);
					}}
				</For>
			</svg>
			{(local.legend ?? true) ? (
				<ul class="flex flex-wrap items-center justify-center gap-3">
					<For each={series()}>
						{(s, i) => (
							<li class="flex items-center gap-1.5 text-xs text-muted-foreground">
								<span
									class="h-2.5 w-2.5 rounded-sm"
									style={{ "background-color": s.color ?? CHART_PALETTE[i() % CHART_PALETTE.length] }}
								/>
								{s.name}
							</li>
						)}
					</For>
				</ul>
			) : null}
		</div>
	);
}
