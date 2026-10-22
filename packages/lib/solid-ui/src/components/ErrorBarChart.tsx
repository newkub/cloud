/**
 * ErrorBarChart — mean points with error whiskers.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ErrorBarItem {
	label: string;
	mean: number;
	error: number;
}

export interface ErrorBarChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: ErrorBarItem[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ErrorBarChart(props: ErrorBarChartProps) {
	const merged = mergeProps({ width: 400, height: 160 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "width", "height", "radius", "elevation"]);

	const view = () => {
		const data = local.data ?? [];
		const lo = Math.min(0, ...data.map((d) => d.mean - d.error));
		const hi = Math.max(1, ...data.map((d) => d.mean + d.error));
		const span = hi - lo || 1;
		const pad = 12;
		const base = local.height - 22;
		const y = (v: number) => base - ((v - lo) / span) * (base - 10);
		const step = (local.width - pad * 2) / Math.max(1, data.length);
		return data.map((d, i) => ({
			...d,
			x: pad + i * step + step / 2,
			yTop: y(d.mean + d.error),
			yMid: y(d.mean),
			yBot: y(d.mean - d.error),
		}));
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
			<svg class="h-40 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Error bar chart">
				<For each={view()}>
					{(d) => (
						<g class="text-primary">
							<line x1={d.x} x2={d.x} y1={d.yTop} y2={d.yBot} stroke="currentColor" stroke-width="1.5" />
							<line x1={d.x - 6} x2={d.x + 6} y1={d.yTop} y2={d.yTop} stroke="currentColor" stroke-width="1.5" />
							<line x1={d.x - 6} x2={d.x + 6} y1={d.yBot} y2={d.yBot} stroke="currentColor" stroke-width="1.5" />
							<circle cx={d.x} cy={d.yMid} r="4" fill="currentColor">
								<title>{`${d.label}: ${d.mean} ± ${d.error}`}</title>
							</circle>
							<text x={d.x} y={local.height - 8} text-anchor="middle" font-size="8" class="fill-muted-foreground">
								{d.label}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
