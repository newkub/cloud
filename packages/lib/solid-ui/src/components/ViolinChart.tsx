/**
 * ViolinChart — mirrored density outline per group (approximate KDE from value histograms).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ViolinItem {
	label: string;
	values: number[];
}

export interface ViolinChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: ViolinItem[];
	/** Histogram bins for the density shape. @default 12 */
	bins?: number;
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ViolinChart(props: ViolinChartProps) {
	const merged = mergeProps({ bins: 12, width: 400, height: 180 }, props);
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

	const view = () => {
		const groups = local.data ?? [];
		const all = groups.flatMap((g) => g.values);
		const lo = Math.min(0, ...all);
		const hi = Math.max(1, ...all);
		const span = hi - lo || 1;
		const pad = 48;
		const rowW = groups.length ? (local.width - pad * 2) / groups.length : 0;
		const _yOf = (v: number) => 8 + ((v - lo) / span) * (local.height - 36);
		return groups.map((g, i) => {
			const cx = pad + i * rowW + rowW / 2;
			const counts = Array.from({ length: local.bins }, () => 0);
			for (const v of g.values) counts[Math.min(local.bins - 1, Math.floor(((v - lo) / span) * local.bins))]++;
			const maxC = Math.max(1, ...counts);
			const half = rowW * 0.32;
			const binH = (local.height - 36) / local.bins;
			const right = counts.map((c, b) => `${(cx + (c / maxC) * half).toFixed(1)},${(8 + b * binH).toFixed(1)}`);
			const left = counts
				.map((c, b) => `${(cx - (c / maxC) * half).toFixed(1)},${(8 + b * binH).toFixed(1)}`)
				.reverse();
			return { cx, label: g.label, d: `M${right.join(" L")} L${left.join(" L")} Z`, n: g.values.length };
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
			<svg class="h-44 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Violin chart">
				<For each={view()}>
					{(g) => (
						<g>
							<path
								d={g.d}
								fill="currentColor"
								class="text-primary"
								opacity="0.25"
								stroke="currentColor"
								stroke-width="1"
							/>
							<text x={g.cx} y={local.height - 6} text-anchor="middle" font-size="9" class="fill-muted-foreground">
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
