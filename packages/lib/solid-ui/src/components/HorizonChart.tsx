/**
 * HorizonChart — area chart sliced into layered bands; dense time series in little space.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface HorizonChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: number[];
	/** Number of bands the area is folded into. @default 3 */
	bands?: number;
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function HorizonChart(props: HorizonChartProps) {
	const merged = mergeProps({ bands: 3, width: 400, height: 64 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"bands",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const paths = () => {
		const data = local.data ?? [];
		if (!data.length) return [];
		const max = Math.max(1e-9, ...data.map(Math.abs));
		const pad = 4;
		const step = (local.width - pad * 2) / Math.max(1, data.length - 1);
		const base = local.height - 4;
		const bandH = (local.height - 8) / local.bands;
		return Array.from({ length: local.bands }, (_, b) => {
			const pts = data.map((v, i) => {
				const frac = Math.min(1, Math.abs(v) / max - b / local.bands) * local.bands;
				return `${(pad + i * step).toFixed(1)},${(base - Math.max(0, frac) * bandH).toFixed(1)}`;
			});
			return `M${pad},${base} L${pts.join(" L")} L${local.width - pad},${base} Z`;
		});
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
			<svg class="h-16 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Horizon chart">
				<For each={paths()}>
					{(d, i) => <path d={d} fill="currentColor" opacity={0.3 + (i() / local.bands) * 0.6} />}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
