/**
 * MosaicChart — variable-width columns subdivided by segment (marimekko-style).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface MosaicColumn {
	label: string;
	/** Column width share — arbitrary units, normalized. */
	share: number;
	/** Segment fractions inside the column — should sum to ~1. */
	segments: { label: string; value: number }[];
}

export interface MosaicChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: MosaicColumn[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

const palette = ["text-primary", "text-info", "text-success", "text-warning", "text-destructive"];

export function MosaicChart(props: MosaicChartProps) {
	const merged = mergeProps({ width: 400, height: 200 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "width", "height", "radius", "elevation"]);

	const layout = () => {
		const cols = local.data ?? [];
		const totalShare = Math.max(
			1e-9,
			cols.reduce((a, c) => a + c.share, 0),
		);
		const gap = 4;
		const innerW = local.width - gap * (cols.length - 1);
		let x = 0;
		return cols.map((c) => {
			const w = (c.share / totalShare) * innerW;
			const segs = c.segments.reduce((a, s) => a + s.value, 0) || 1;
			let y = 0;
			const rects = c.segments.map((s, si) => {
				const h = (s.value / segs) * (local.height - 20);
				const r = { x, y, w, h, label: `${c.label} · ${s.label}`, cls: palette[si % palette.length] };
				y += h;
				return r;
			});
			const col = { rects, label: c.label, cx: x + w / 2 };
			x += w + gap;
			return col;
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
			<svg class="h-52 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Mosaic chart">
				<For each={layout()}>
					{(col) => (
						<g>
							<For each={col.rects}>
								{(r) => (
									<rect x={r.x} y={r.y} width={r.w} height={r.h} fill="currentColor" class={r.cls} opacity="0.8">
										<title>{r.label}</title>
									</rect>
								)}
							</For>
							<text x={col.cx} y={local.height - 6} text-anchor="middle" font-size="9" class="fill-muted-foreground">
								{col.label}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
