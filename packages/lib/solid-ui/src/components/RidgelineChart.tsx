/**
 * RidgelineChart — stacked overlapping density rows (joy-plot style).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface RidgelineRow {
	label: string;
	/** Density samples — normalized to each row's peak. */
	values: number[];
}

export interface RidgelineChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: RidgelineRow[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function RidgelineChart(props: RidgelineChartProps) {
	const merged = mergeProps({ width: 400, height: 200 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "width", "height", "radius", "elevation"]);

	const rows = () => local.data ?? [];
	const rowH = () => local.height / Math.max(1, rows().length);

	const path = (r: RidgelineRow, i: number) => {
		const max = Math.max(1, ...r.values);
		const baseY = (i + 1) * rowH();
		const amp = rowH() * 0.9;
		const pad = 56;
		const step = (local.width - pad - 8) / Math.max(1, r.values.length - 1);
		const pts = r.values.map((v, j) => `${pad + j * step},${baseY - (v / max) * amp}`);
		return `M${pad},${baseY} L${pts.join(" L")} L${local.width - 8},${baseY} Z`;
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
			<svg class="h-52 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Ridgeline chart">
				<For each={rows()}>
					{(r, i) => (
						<g>
							<path d={path(r, i())} fill="currentColor" class="text-primary" opacity="0.25" />
							<path d={path(r, i())} fill="none" stroke="currentColor" stroke-width="1.5" class="text-primary" />
							<text x={8} y={(i() + 1) * rowH() - 4} font-size="9" class="fill-muted-foreground">
								{r.label}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
