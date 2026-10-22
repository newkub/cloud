/**
 * LatencyChart — banded multi-series area lines (e.g. p50/p95/p99) with a legend.
 */
import { For, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface LatencySeries {
	/** Series name shown in the legend */
	label: string;
	/** Values, oldest first */
	values: number[];
}

export interface LatencyChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Series to plot (e.g. p50/p95/p99) */
	series: LatencySeries[];
	/** Unit suffix for the aria label @default "ms" */
	unit?: string;
	/** Viewport width @default 320 */
	width?: number;
	/** Viewport height @default 140 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_X = 10;
const PAD_TOP = 10;
const PAD_BOTTOM = 14;

const STROKES = ["stroke-primary", "stroke-warning", "stroke-destructive", "stroke-info", "stroke-success"];
const DOTS = ["bg-primary", "bg-warning", "bg-destructive", "bg-info", "bg-success"];

export function LatencyChart(props: LatencyChartProps) {
	const merged = mergeProps({ unit: "ms", width: 320, height: 140 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"series",
		"unit",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const base = () => local.height - PAD_BOTTOM;
	const n = () => Math.max(1, ...(local.series ?? []).map((s) => s.values.length));
	const maxV = () => Math.max(1, ...(local.series ?? []).flatMap((s) => s.values));
	const x = (i: number) => PAD_X + (i / Math.max(1, n() - 1)) * (local.width - PAD_X * 2);
	const y = (v: number) => base() - (v / maxV()) * (base() - PAD_TOP);

	const linePath = (values: number[]) => {
		if (!values.length) return "";
		const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
		return `M${pts.join(" L")}`;
	};

	const bandPath = () => {
		const series = (local.series ?? []).filter((s) => s.values.length);
		if (series.length < 2) return "";
		const len = n();
		const hi: string[] = [];
		const lo: string[] = [];
		for (let i = 0; i < len; i++) {
			const vals = series.map((s) => s.values[Math.min(i, s.values.length - 1)]);
			hi.push(`${x(i).toFixed(1)},${y(Math.max(...vals)).toFixed(1)}`);
			lo.push(`${x(i).toFixed(1)},${y(Math.min(...vals)).toFixed(1)}`);
		}
		return `M${hi.join(" L")} L${lo.reverse().join(" L")} Z`;
	};

	return (
		<div
			class={[
				"solidui-latency-chart inline-block",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg
				width={local.width}
				height={local.height}
				viewBox={`0 0 ${local.width} ${local.height}`}
				class="max-w-full"
				role="img"
				aria-label={`Latency: ${(local.series ?? []).map((s) => s.label).join(", ")} in ${local.unit}`}
			>
				<line x1={PAD_X} y1={base()} x2={local.width - PAD_X} y2={base()} class="stroke-border" stroke-width="1" />
				<Show when={bandPath()}>
					<path d={bandPath()} class="fill-primary/10" />
				</Show>
				<For each={local.series ?? []}>
					{(s, i) => (
						<path
							d={linePath(s.values)}
							fill="none"
							class={STROKES[i() % STROKES.length]}
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					)}
				</For>
			</svg>
			<div class="mt-1 flex flex-wrap items-center gap-3 text-2xs text-muted-foreground">
				<For each={local.series ?? []}>
					{(s, i) => (
						<span class="inline-flex items-center gap-1">
							<span class={`h-2 w-2 rounded-full ${DOTS[i() % DOTS.length]}`} />
							{s.label}
						</span>
					)}
				</For>
			</div>
			{local.children}
		</div>
	);
}
