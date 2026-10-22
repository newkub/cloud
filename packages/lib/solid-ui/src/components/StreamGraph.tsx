/**
 * StreamGraph — flowing stacked areas around a wiggle baseline.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface StreamGraphProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Series of equal-length value arrays. */
	data?: { label: string; values: number[] }[];
	periods?: string[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

const palette = ["text-primary", "text-info", "text-success", "text-warning", "text-destructive"];

export function StreamGraph(props: StreamGraphProps) {
	const merged = mergeProps({ width: 400, height: 200 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"periods",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const layers = () => {
		const series = local.data ?? [];
		const n = Math.max(1, ...series.map((s) => s.values.length));
		const pad = 8;
		const innerW = local.width - pad * 2;
		const innerH = local.height - 24;
		const step = innerW / Math.max(1, n - 1);
		const totals = Array.from({ length: n }, (_, j) => series.reduce((a, s) => a + (s.values[j] ?? 0), 0));
		const maxTotal = Math.max(1, ...totals);
		// wiggle baseline: shift so the stack centers loosely
		const bottoms: number[] = totals.map((t) => (1 - t / maxTotal) * innerH * 0.5 + 12);
		let acc = series[0]?.values.map(() => 0) ?? [];
		return series.map((s) => {
			const top = s.values.map((_v, j) => bottoms[j] + (acc[j] / maxTotal) * innerH);
			const bot = s.values.map((v, j) => bottoms[j] + ((acc[j] + v) / maxTotal) * innerH);
			acc = acc.map((a, j) => a + s.values[j]);
			const fwd = top.map((y, j) => `${(pad + j * step).toFixed(1)},${y.toFixed(1)}`).join(" L");
			const back = bot
				.map((y, j) => `${(pad + j * step).toFixed(1)},${y.toFixed(1)}`)
				.reverse()
				.join(" L");
			return { label: s.label, d: `M${fwd} L${back} Z` };
		});
	};

	return (
		<div
			class={[
				"w-full",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="h-52 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Stream graph">
				<For each={layers()}>
					{(l, i) => (
						<path d={l.d} fill="currentColor" class={palette[i() % palette.length]} opacity="0.7">
							<title>{l.label}</title>
						</path>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
