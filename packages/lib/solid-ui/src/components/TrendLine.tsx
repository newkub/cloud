/**
 * TrendLine — sparkline paired with a big delta percentage and up/down arrow.
 */
import { type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface TrendLineProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Series values, oldest first */
	data?: number[];
	/** Format the latest value @default String(v) */
	formatValue?: (v: number) => string;
	/** Treat a downward delta as good @default false */
	invert?: boolean;
	/** Accessible label for the svg */
	label?: string;
	/** Sparkline viewport width @default 96 */
	width?: number;
	/** Sparkline viewport height @default 28 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TrendLine(props: TrendLineProps) {
	const merged = mergeProps({ width: 96, height: 28 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"formatValue",
		"invert",
		"label",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const points = () => {
		const data = local.data ?? [];
		if (data.length === 0) return "";
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const stepX = data.length > 1 ? local.width / (data.length - 1) : local.width;
		return data
			.map(
				(v, i) =>
					`${(i * stepX).toFixed(2)},${(local.height - 2 - ((v - min) / range) * (local.height - 4)).toFixed(2)}`,
			)
			.join(" ");
	};

	const delta = () => {
		const data = local.data ?? [];
		if (data.length < 2) return 0;
		const first = data[0];
		const last = data[data.length - 1];
		return first === 0 ? (last === 0 ? 0 : 100) : ((last - first) / Math.abs(first)) * 100;
	};
	const up = () => delta() >= 0;
	const good = () => (local.invert ? !up() : up());
	const tone = () => (good() ? "text-success" : "text-destructive");
	const last = () => (local.data ?? []).slice(-1)[0] ?? 0;

	return (
		<div
			class={[
				"solidui-trend-line inline-flex items-center gap-3",
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
				class="text-primary"
				role="img"
				aria-label={local.label ?? `Trend: ${(local.data ?? []).length} points, delta ${delta().toFixed(1)}%`}
			>
				<polyline
					points={points()}
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<div class="flex flex-col leading-tight">
				<span class={`inline-flex items-center gap-1 text-lg font-semibold tabular-nums ${tone()}`}>
					<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="shrink-0">
						<path d={up() ? "M5 1 L9 8 L1 8 Z" : "M5 9 L9 2 L1 2 Z"} fill="currentColor" />
					</svg>
					{Math.abs(delta()).toFixed(1)}%
				</span>
				<Show when={(local.data ?? []).length > 0}>
					<span class="text-2xs text-muted-foreground tabular-nums">{(local.formatValue ?? String)(last())}</span>
				</Show>
			</div>
			{local.children}
		</div>
	);
}
