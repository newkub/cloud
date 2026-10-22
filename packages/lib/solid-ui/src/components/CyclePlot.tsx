/**
 * CyclePlot — seasonal subseries: one mini-panel per cycle position with mean line.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CyclePlotProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** One entry per cycle position (e.g. 12 months). */
	data?: { label: string; values: number[] }[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function CyclePlot(props: CyclePlotProps) {
	const merged = mergeProps({ width: 400, height: 140 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "width", "height", "radius", "elevation"]);

	const view = () => {
		const groups = local.data ?? [];
		const all = groups.flatMap((g) => g.values);
		const lo = Math.min(0, ...all);
		const hi = Math.max(1, ...all);
		const span = hi - lo || 1;
		const base = local.height - 20;
		const y = (v: number) => base - ((v - lo) / span) * (base - 10);
		const cellW = groups.length ? local.width / groups.length : 0;
		return groups.map((g, i) => {
			const n = g.values.length;
			const step = n > 1 ? (cellW - 16) / (n - 1) : 0;
			const x0 = i * cellW;
			const pts = g.values.map((v, j) => `${x0 + 8 + j * step},${y(v)}`);
			const mean = g.values.reduce((a, v) => a + v, 0) / Math.max(1, n);
			return { x0, w: cellW, label: g.label, pts: pts.join(" "), meanY: y(mean) };
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
			<svg class="h-36 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Cycle plot">
				<For each={view()}>
					{(g) => (
						<g>
							<line x1={g.x0} x2={g.x0} y1={8} y2={local.height - 20} stroke="currentColor" class="text-border" />
							<polyline
								points={g.pts}
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								class="text-primary"
								stroke-linejoin="round"
							/>
							<line
								x1={g.x0 + 6}
								x2={g.x0 + g.w - 6}
								y1={g.meanY}
								y2={g.meanY}
								stroke="currentColor"
								stroke-dasharray="3 3"
								class="text-warning"
							/>
							<text
								x={g.x0 + g.w / 2}
								y={local.height - 6}
								text-anchor="middle"
								font-size="8"
								class="fill-muted-foreground"
							>
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
