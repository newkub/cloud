/**
 * CirclePackChart — nested circles sized by value (simple one-level packing).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CirclePackNode {
	label: string;
	value: number;
	/** Optional children rendered inside the parent circle (top-aligned). */
	children?: CirclePackNode[];
}

export interface CirclePackChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: CirclePackNode[];
	size?: number;
	radius?: Radius;
	elevation?: Elevation;
}

const palette = [
	"text-primary",
	"text-info",
	"text-success",
	"text-warning",
	"text-destructive",
	"text-muted-foreground",
];

export function CirclePackChart(props: CirclePackChartProps) {
	const merged = mergeProps({ size: 240 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "size", "radius", "elevation"]);

	/** Simple row packing: circles in a spiral-free horizontal wrap inside the disc. */
	const circles = () => {
		const data = local.data ?? [];
		const c = local.size / 2;
		const total = Math.max(
			1e-9,
			data.reduce((a, n) => a + n.value, 0),
		);
		const availR = c - 8;
		// radius ∝ sqrt(value share), capped so the row fits
		const radii = data.map((n) => Math.max(10, Math.sqrt(n.value / total) * availR));
		const sumR = radii.reduce((a, r) => a + r, 0);
		const scale = Math.min(1, availR / (sumR || 1));
		let x = c - Math.min(availR, sumR * scale);
		const cy = c;
		return data.map((n, i) => {
			const r = radii[i] * scale;
			const node = { cx: x + r, cy, r, label: `${n.label}: ${n.value}`, cls: palette[i % palette.length] };
			x += r * 2 + 4;
			return node;
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
			<svg
				class="mx-auto"
				width={local.size}
				height={local.size}
				viewBox={`0 0 ${local.size} ${local.size}`}
				role="img"
				aria-label="Circle pack chart"
			>
				<circle
					cx={local.size / 2}
					cy={local.size / 2}
					r={local.size / 2 - 4}
					fill="none"
					stroke="currentColor"
					class="text-border"
				/>
				<For each={circles()}>
					{(n) => (
						<g>
							<circle cx={n.cx} cy={n.cy} r={n.r} fill="currentColor" class={n.cls} opacity="0.3" stroke="currentColor">
								<title>{n.label}</title>
							</circle>
							{n.r > 18 && (
								<text x={n.cx} y={n.cy + 3} text-anchor="middle" font-size="9" class="fill-foreground">
									{n.label.split(":")[0]}
								</text>
							)}
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
