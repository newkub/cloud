/**
 * BeeswarmChart — jittered dots along a value axis; distribution without overlap.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BeeswarmChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: number[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

/** Deterministic jitter — stable across renders for the same index. */
const jitter = (i: number) => (Math.sin(i * 12.9898) * 43758.5453) % 1;

export function BeeswarmChart(props: BeeswarmChartProps) {
	const merged = mergeProps({ width: 400, height: 120 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "width", "height", "radius", "elevation"]);

	const points = () => {
		const data = local.data ?? [];
		if (!data.length) return [];
		const min = Math.min(...data);
		const max = Math.max(...data);
		const span = max - min || 1;
		const pad = 16;
		const mid = local.height / 2;
		const amp = local.height / 2 - 14;
		return data.map((v, i) => ({
			x: pad + ((v - min) / span) * (local.width - pad * 2),
			y: mid + jitter(i) * amp,
			v,
		}));
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
			<svg class="h-28 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Beeswarm chart">
				<line
					x1={12}
					x2={local.width - 12}
					y1={local.height / 2}
					y2={local.height / 2}
					stroke="currentColor"
					class="text-border"
				/>
				<For each={points()}>
					{(p) => (
						<circle cx={p.x} cy={p.y} r="3.5" fill="currentColor" opacity="0.75">
							<title>{p.v}</title>
						</circle>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
