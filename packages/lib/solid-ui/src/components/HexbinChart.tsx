/**
 * HexbinChart — point cloud aggregated into hex cells; color = density.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface HexbinChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Raw points in data coordinates. */
	data?: { x: number; y: number }[];
	/** Hex grid resolution. @default 10 */
	bins?: number;
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

const hexPath = (cx: number, cy: number, r: number) => {
	const pts = Array.from({ length: 6 }, (_, i) => {
		const a = (Math.PI / 3) * i + Math.PI / 6;
		return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
	});
	return `M${pts.join(" L")} Z`;
};

export function HexbinChart(props: HexbinChartProps) {
	const merged = mergeProps({ bins: 10, width: 400, height: 200 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"data",
		"bins",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const cells = () => {
		const data = local.data ?? [];
		if (!data.length) return [];
		const xs = data.map((p) => p.x);
		const ys = data.map((p) => p.y);
		const loX = Math.min(...xs);
		const loY = Math.min(...ys);
		const spanX = Math.max(...xs) - loX || 1;
		const spanY = Math.max(...ys) - loY || 1;
		const grid = new Map<string, number>();
		for (const p of data) {
			const gx = Math.floor(((p.x - loX) / spanX) * (local.bins - 1e-9));
			const gy = Math.floor(((p.y - loY) / spanY) * (local.bins - 1e-9));
			const key = `${gx},${gy}`;
			grid.set(key, (grid.get(key) ?? 0) + 1);
		}
		const max = Math.max(1, ...grid.values());
		const pad = 12;
		const cw = (local.width - pad * 2) / local.bins;
		const ch = (local.height - pad * 2) / local.bins;
		return [...grid.entries()].map(([key, count]) => {
			const [gx, gy] = key.split(",").map(Number);
			return {
				d: hexPath(pad + gx * cw + cw / 2, pad + gy * ch + ch / 2, Math.min(cw, ch) / 2),
				opacity: 0.2 + (count / max) * 0.8,
				count,
			};
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
			<svg class="h-52 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Hexbin chart">
				<For each={cells()}>
					{(c) => (
						<path d={c.d} fill="currentColor" opacity={c.opacity}>
							<title>{c.count} points</title>
						</path>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
