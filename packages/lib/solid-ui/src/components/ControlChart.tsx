/**
 * ControlChart — process line with mean + UCL/LCL bands; out-of-control points highlighted.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ControlChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: number[];
	labels?: string[];
	/** Sigma multiplier for control limits. @default 3 */
	sigma?: number;
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ControlChart(props: ControlChartProps) {
	const merged = mergeProps({ sigma: 3, width: 400, height: 160 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"labels",
		"sigma",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const view = () => {
		const data = local.data ?? [];
		if (!data.length) return null;
		const mean = data.reduce((a, v) => a + v, 0) / data.length;
		const sd = Math.sqrt(data.reduce((a, v) => a + (v - mean) ** 2, 0) / data.length);
		const ucl = mean + local.sigma * sd;
		const lcl = mean - local.sigma * sd;
		const lo = Math.min(lcl, ...data);
		const hi = Math.max(ucl, ...data);
		const span = hi - lo || 1;
		const pad = 12;
		const base = local.height - 20;
		const step = (local.width - pad * 2) / Math.max(1, data.length - 1);
		const y = (v: number) => base - ((v - lo) / span) * (base - 12);
		const pts = data.map((v, i) => ({ x: pad + i * step, y: y(v), out: v > ucl || v < lcl }));
		return {
			pts: pts.map((p) => `${p.x},${p.y}`).join(" "),
			marks: pts,
			meanY: y(mean),
			uclY: y(ucl),
			lclY: y(lcl),
		};
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
			<svg class="h-40 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Control chart">
				{view() && (
					<>
						<line
							x1={8}
							x2={local.width - 8}
							y1={view()?.uclY}
							y2={view()?.uclY}
							stroke="currentColor"
							stroke-dasharray="4 3"
							class="text-warning"
						/>
						<line
							x1={8}
							x2={local.width - 8}
							y1={view()?.meanY}
							y2={view()?.meanY}
							stroke="currentColor"
							stroke-dasharray="4 3"
							class="text-muted-foreground"
						/>
						<line
							x1={8}
							x2={local.width - 8}
							y1={view()?.lclY}
							y2={view()?.lclY}
							stroke="currentColor"
							stroke-dasharray="4 3"
							class="text-warning"
						/>
						<polyline
							points={view()?.pts}
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="text-primary"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<For each={view()?.marks}>
							{(p) => (
								<circle
									cx={p.x}
									cy={p.y}
									r="3"
									fill="currentColor"
									class={p.out ? "text-destructive" : "text-primary"}
								/>
							)}
						</For>
					</>
				)}
			</svg>
			{local.children}
		</div>
	);
}
