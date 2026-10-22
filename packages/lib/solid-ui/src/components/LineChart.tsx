/**
 * LineChart — polyline SVG chart with optional multi-series, grid, and legend.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { CHART_PALETTE } from "./PieChart";

export interface LineSeries {
	/** Series name (legend) */
	name: string;
	/** Series values */
	data: number[];
	/** Line color — CSS color; defaults cycle the theme palette */
	color?: string;
}

export interface LineChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Single-series shorthand — ignored when `series` is set */
	data?: number[];
	/** Multi-series data */
	series?: LineSeries[];
	/** X-axis labels aligned with the values */
	labels?: string[];
	/** Accessible label for the svg */
	label?: string;
	/** Viewport width @default 320 */
	width?: number;
	/** Viewport height @default 160 */
	height?: number;
	/** Fixed y-axis minimum @default auto */
	yMin?: number;
	/** Fixed y-axis maximum @default auto */
	yMax?: number;
	/** Interpolation — step variants suit discrete changes (prices, tiers) @default "linear" */
	curve?: "linear" | "step-before" | "step-after" | "step-middle";
	/** Show point dots @default true */
	showDots?: boolean;
	/** Show horizontal grid lines @default true */
	showGrid?: boolean;
	/** Show series legend @default true (multi-series only) */
	showLegend?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_X = 10;
const PAD_TOP = 10;
const PAD_BOTTOM = 18;

interface Pt {
	x: number;
	y: number;
}

export function LineChart(props: LineChartProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"series",
		"labels",
		"label",
		"width",
		"height",
		"yMin",
		"yMax",
		"curve",
		"showDots",
		"showGrid",
		"showLegend",
		"radius",
		"elevation",
	]);
	const w = () => local.width ?? 320;
	const h = () => local.height ?? 160;
	const base = () => h() - PAD_BOTTOM;
	const series = (): LineSeries[] =>
		local.series ?? (local.data ? [{ name: local.label ?? "Series", data: local.data }] : []);
	const lo = () => {
		const all = series().flatMap((s) => s.data);
		return local.yMin ?? Math.min(0, ...all);
	};
	const hi = () => {
		const all = series().flatMap((s) => s.data);
		return local.yMax ?? Math.max(1, ...all);
	};
	const pts = (data: number[]): Pt[] => {
		if (data.length === 0) return [];
		const range = hi() - lo() || 1;
		const pw = w() - PAD_X * 2;
		const ph = base() - PAD_TOP;
		const n = Math.max(1, data.length - 1);
		return data.map((v, i) => ({
			x: data.length === 1 ? w() / 2 : PAD_X + (i / n) * pw,
			y: PAD_TOP + ph - ((v - lo()) / range) * ph,
		}));
	};
	const path = (data: number[]) => {
		const p = pts(data);
		if (p.length === 0) return "";
		const curve = local.curve ?? "linear";
		if (curve === "linear") return `M ${p.map((pt) => `${pt.x} ${pt.y}`).join(" L ")}`;
		let d = `M ${p[0].x} ${p[0].y}`;
		for (let i = 1; i < p.length; i++) {
			const prev = p[i - 1];
			const cur = p[i];
			if (curve === "step-before") d += ` L ${prev.x} ${cur.y} L ${cur.x} ${cur.y}`;
			else if (curve === "step-middle") {
				const mid = (prev.x + cur.x) / 2;
				d += ` L ${mid} ${prev.y} L ${mid} ${cur.y} L ${cur.x} ${cur.y}`;
			} else d += ` L ${cur.x} ${prev.y} L ${cur.x} ${cur.y}`;
		}
		return d;
	};
	const summary = () =>
		local.label ??
		`Line chart: ${
			series()
				.map((s) => s.name)
				.join(", ") || "empty"
		}`;
	return (
		<div
			class={`solidui-line-chart inline-block ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg width={w()} height={h()} viewBox={`0 0 ${w()} ${h()}`} class="max-w-full" role="img" aria-label={summary()}>
				<Show when={local.label}>
					<title>{local.label}</title>
				</Show>
				<Show when={local.showGrid ?? true}>
					<For each={[0.25, 0.5, 0.75]}>
						{(f) => (
							<line
								x1={PAD_X}
								y1={PAD_TOP + f * (base() - PAD_TOP)}
								x2={w() - PAD_X}
								y2={PAD_TOP + f * (base() - PAD_TOP)}
								class="stroke-border"
								stroke-width="0.5"
								stroke-dasharray="3 3"
							/>
						)}
					</For>
				</Show>
				<line x1={PAD_X} y1={base()} x2={w() - PAD_X} y2={base()} class="stroke-border" stroke-width="1" />
				<For each={series()}>
					{(s, i) => {
						const color = () => s.color ?? CHART_PALETTE[i() % CHART_PALETTE.length];
						return (
							<g>
								<path
									d={path(s.data)}
									fill="none"
									stroke={color()}
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<Show when={local.showDots ?? true}>
									<For each={pts(s.data)}>{(p) => <circle cx={p.x} cy={p.y} r="2.5" fill={color()} />}</For>
								</Show>
							</g>
						);
					}}
				</For>
				<For each={local.labels ?? []}>
					{(t, i) => (
						<text
							x={pts(series()[0]?.data ?? [])[i()]?.x ?? 0}
							y={h() - 4}
							text-anchor="middle"
							class="fill-muted-foreground"
							font-size="8"
						>
							{t}
						</text>
					)}
				</For>
			</svg>
			<Show when={(local.showLegend ?? true) && series().length > 1}>
				<ul class="mt-1 flex flex-wrap items-center gap-3">
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
			</Show>
		</div>
	);
}
