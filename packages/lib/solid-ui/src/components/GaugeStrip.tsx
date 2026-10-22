/**
 * GaugeStrip — horizontal row of mini arc gauges with labels.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface GaugeStripItem {
	/** Caption under the gauge */
	label: string;
	/** Current value */
	value: number;
	/** Scale maximum @default 100 */
	max?: number;
}

export interface GaugeStripProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Gauges to render */
	items: GaugeStripItem[];
	/** Width of each mini gauge in px @default 64 */
	size?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pt = (cx: number, cy: number, r: number, f: number) => {
	const a = Math.PI * (1 + f);
	return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
};

const arc = (cx: number, cy: number, r: number, f0: number, f1: number) =>
	`M${pt(cx, cy, r, f0)} A${r},${r} 0 ${f1 - f0 > 0.5 ? 1 : 0} 1 ${pt(cx, cy, r, f1)}`;

export function GaugeStrip(props: GaugeStripProps) {
	const merged = mergeProps({ size: 64 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "items", "size", "radius", "elevation"]);

	const cx = () => local.size / 2;
	const cy = () => local.size / 2 + 4;
	const r = () => local.size / 2 - 6;
	const frac = (item: GaugeStripItem) => Math.min(1, Math.max(0, item.value / (item.max ?? 100) || 0));

	return (
		<div
			class={[
				"solidui-gauge-strip inline-flex items-start gap-4",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<For each={local.items ?? []}>
				{(item) => (
					<div class="flex flex-col items-center gap-1">
						<svg
							width={local.size}
							height={local.size / 2 + 8}
							viewBox={`0 0 ${local.size} ${local.size / 2 + 8}`}
							role="img"
							aria-label={`${item.label}: ${item.value} of ${item.max ?? 100}`}
						>
							<path
								d={arc(cx(), cy(), r(), 0, 1)}
								fill="none"
								stroke="currentColor"
								stroke-width="6"
								class="text-muted"
								stroke-linecap="round"
							/>
							<path
								d={arc(cx(), cy(), r(), 0, Math.max(0.02, frac(item)))}
								fill="none"
								stroke="currentColor"
								stroke-width="6"
								class="text-primary"
								stroke-linecap="round"
							/>
							<text
								x={cx()}
								y={cy() - 2}
								text-anchor="middle"
								font-size="11"
								class="fill-foreground font-semibold tabular-nums"
							>
								{item.value}
							</text>
						</svg>
						<span class="text-2xs text-muted-foreground">{item.label}</span>
					</div>
				)}
			</For>
			{local.children}
		</div>
	);
}
