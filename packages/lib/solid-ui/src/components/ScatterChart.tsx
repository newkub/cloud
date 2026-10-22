/**
 * ScatterChart — SVG x/y dot plot with axes and tick marks.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ScatterPoint {
	/** X value */
	x: number;
	/** Y value */
	y: number;
	/** Tooltip label */
	label?: string;
	/** Dot color — CSS color @default theme primary */
	color?: string;
}

export interface ScatterChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Points */
	data: ScatterPoint[];
	/** Accessible label for the svg */
	label?: string;
	/** Viewport width @default 320 */
	width?: number;
	/** Viewport height @default 200 */
	height?: number;
	/** Dot radius @default 3 */
	dotSize?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_L = 30;
const PAD_R = 10;
const PAD_T = 10;
const PAD_B = 20;
const TICKS = 4;

const fmt = (v: number) => String(Math.round(v * 100) / 100);

export function ScatterChart(props: ScatterChartProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"label",
		"width",
		"height",
		"dotSize",
		"radius",
		"elevation",
	]);
	const w = () => local.width ?? 320;
	const h = () => local.height ?? 200;
	const data = () => local.data ?? [];
	const xLo = () => {
		const xs = data().map((d) => d.x);
		const m = xs.length ? Math.min(...xs) : 0;
		return m;
	};
	const xHi = () => {
		const xs = data().map((d) => d.x);
		const m = xs.length ? Math.max(...xs) : 1;
		return m === xLo() ? m + 1 : m;
	};
	const yLo = () => {
		const ys = data().map((d) => d.y);
		return ys.length ? Math.min(0, ...ys) : 0;
	};
	const yHi = () => {
		const ys = data().map((d) => d.y);
		const m = ys.length ? Math.max(1, ...ys) : 1;
		return m === yLo() ? m + 1 : m;
	};
	const sx = (x: number) => PAD_L + ((x - xLo()) / (xHi() - xLo() || 1)) * (w() - PAD_L - PAD_R);
	const sy = (y: number) => PAD_T + (1 - (y - yLo()) / (yHi() - yLo() || 1)) * (h() - PAD_T - PAD_B);
	const xTicks = () => Array.from({ length: TICKS + 1 }, (_, i) => xLo() + (i / TICKS) * (xHi() - xLo()));
	const yTicks = () => Array.from({ length: TICKS + 1 }, (_, i) => yLo() + (i / TICKS) * (yHi() - yLo()));
	return (
		<div
			class={`solidui-scatter-chart inline-block ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={w()}
				height={h()}
				viewBox={`0 0 ${w()} ${h()}`}
				class="max-w-full"
				role="img"
				aria-label={local.label ?? `Scatter chart: ${data().length} points`}
			>
				<Show when={local.label}>
					<title>{local.label}</title>
				</Show>
				<line x1={PAD_L} y1={h() - PAD_B} x2={w() - PAD_R} y2={h() - PAD_B} class="stroke-border" stroke-width="1" />
				<line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={h() - PAD_B} class="stroke-border" stroke-width="1" />
				<For each={yTicks()}>
					{(t) => (
						<g>
							<line x1={PAD_L - 3} y1={sy(t)} x2={PAD_L} y2={sy(t)} class="stroke-border" stroke-width="1" />
							<text
								x={PAD_L - 5}
								y={sy(t)}
								text-anchor="end"
								dy="0.32em"
								class="fill-muted-foreground tabular-nums"
								font-size="7"
							>
								{fmt(t)}
							</text>
						</g>
					)}
				</For>
				<For each={xTicks()}>
					{(t) => (
						<g>
							<line
								x1={sx(t)}
								y1={h() - PAD_B}
								x2={sx(t)}
								y2={h() - PAD_B + 3}
								class="stroke-border"
								stroke-width="1"
							/>
							<text
								x={sx(t)}
								y={h() - PAD_B + 10}
								text-anchor="middle"
								class="fill-muted-foreground tabular-nums"
								font-size="7"
							>
								{fmt(t)}
							</text>
						</g>
					)}
				</For>
				<For each={data()}>
					{(d) => (
						<circle
							cx={sx(d.x)}
							cy={sy(d.y)}
							r={local.dotSize ?? 3}
							class={d.color ? "" : "fill-primary"}
							style={d.color ? { fill: d.color } : undefined}
						>
							<Show when={d.label}>
								<title>{`${d.label}: ${d.x}, ${d.y}`}</title>
							</Show>
						</circle>
					)}
				</For>
			</svg>
		</div>
	);
}
