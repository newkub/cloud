/**
 * BoxPlot — quartile box + whiskers per group (Tukey box-and-whisker).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BoxPlotItem {
	label: string;
	values: number[];
}

export interface BoxPlotProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: BoxPlotItem[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

const quantile = (sorted: number[], q: number) => {
	const pos = (sorted.length - 1) * q;
	const base = Math.floor(pos);
	return sorted[base] + (sorted[base + 1] !== undefined ? (sorted[base + 1] - sorted[base]) * (pos - base) : 0);
};

export function BoxPlot(props: BoxPlotProps) {
	const merged = mergeProps({ width: 400, height: 180 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "width", "height", "radius", "elevation"]);

	const view = () => {
		const groups = (local.data ?? []).map((g) => {
			const s = [...g.values].sort((a, b) => a - b);
			return {
				label: g.label,
				min: s[0] ?? 0,
				q1: quantile(s, 0.25),
				med: quantile(s, 0.5),
				q3: quantile(s, 0.75),
				max: s[s.length - 1] ?? 0,
			};
		});
		const lo = Math.min(0, ...groups.map((g) => g.min));
		const hi = Math.max(1, ...groups.map((g) => g.max));
		const span = hi - lo || 1;
		const pad = 40;
		const base = local.height - 24;
		const y = (v: number) => base - ((v - lo) / span) * (base - 12);
		const bw = groups.length ? (local.width - pad * 2) / groups.length : 0;
		return groups.map((g, i) => ({ ...g, cx: pad + i * bw + bw / 2, bw: Math.min(28, bw * 0.5), y }));
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
			<svg class="h-44 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Box plot">
				<For each={view()}>
					{(g) => (
						<g>
							<line
								x1={g.cx}
								x2={g.cx}
								y1={g.y(g.min)}
								y2={g.y(g.max)}
								stroke="currentColor"
								class="text-muted-foreground"
							/>
							<line
								x1={g.cx - 8}
								x2={g.cx + 8}
								y1={g.y(g.min)}
								y2={g.y(g.min)}
								stroke="currentColor"
								class="text-muted-foreground"
							/>
							<line
								x1={g.cx - 8}
								x2={g.cx + 8}
								y1={g.y(g.max)}
								y2={g.y(g.max)}
								stroke="currentColor"
								class="text-muted-foreground"
							/>
							<rect
								x={g.cx - g.bw / 2}
								y={g.y(g.q3)}
								width={g.bw}
								height={Math.max(1, g.y(g.q1) - g.y(g.q3))}
								fill="currentColor"
								class="text-primary"
								opacity="0.25"
								stroke="currentColor"
							/>
							<line
								x1={g.cx - g.bw / 2}
								x2={g.cx + g.bw / 2}
								y1={g.y(g.med)}
								y2={g.y(g.med)}
								stroke="currentColor"
								stroke-width="2"
								class="text-primary"
							/>
							<text x={g.cx} y={local.height - 8} text-anchor="middle" font-size="9" class="fill-muted-foreground">
								{g.label}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
