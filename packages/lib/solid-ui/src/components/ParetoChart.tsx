/**
 * ParetoChart — sorted bars with a cumulative-percentage line (80/20 view).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ParetoChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: { label: string; value: number }[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ParetoChart(props: ParetoChartProps) {
	const merged = mergeProps({ width: 400, height: 180 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "width", "height", "radius", "elevation"]);

	const view = () => {
		const sorted = [...(local.data ?? [])].sort((a, b) => b.value - a.value);
		const total = Math.max(
			1e-9,
			sorted.reduce((a, d) => a + d.value, 0),
		);
		const max = Math.max(1, ...sorted.map((d) => d.value));
		const pad = 8;
		const base = local.height - 20;
		const innerW = local.width - pad * 2;
		const bw = sorted.length ? innerW / sorted.length : 0;
		let cum = 0;
		const line: string[] = [];
		const bars = sorted.map((d, i) => {
			cum += d.value;
			const x = pad + i * bw;
			const h = (d.value / max) * (base - 12);
			line.push(`${(x + bw / 2).toFixed(1)},${(base - (cum / total) * (base - 12)).toFixed(1)}`);
			return { x, y: base - h, w: Math.max(1, bw - 2), h, label: d.label, v: d.value };
		});
		return { bars, line: line.join(" ") };
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
			<svg class="h-44 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Pareto chart">
				<For each={view().bars}>
					{(b) => (
						<g>
							<rect x={b.x} y={b.y} width={b.w} height={b.h} fill="currentColor" class="text-primary" opacity="0.8">
								<title>{`${b.label}: ${b.v}`}</title>
							</rect>
							<text
								x={b.x + b.w / 2}
								y={local.height - 8}
								text-anchor="middle"
								font-size="8"
								class="fill-muted-foreground"
							>
								{b.label}
							</text>
						</g>
					)}
				</For>
				<polyline
					points={view().line}
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="text-warning"
					stroke-linecap="round"
				/>
			</svg>
			{local.children}
		</div>
	);
}
