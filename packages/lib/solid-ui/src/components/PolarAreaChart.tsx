/**
 * PolarAreaChart — Nightingale/rose wedges: equal angles, value = radius.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface PolarAreaChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: { label: string; value: number }[];
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

export function PolarAreaChart(props: PolarAreaChartProps) {
	const merged = mergeProps({ size: 200 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "size", "radius", "elevation"]);

	const wedges = () => {
		const data = local.data ?? [];
		const max = Math.max(1, ...data.map((d) => d.value));
		const c = local.size / 2;
		const rMax = c - 8;
		const angle = (Math.PI * 2) / Math.max(1, data.length);
		return data.map((d, i) => {
			const a0 = i * angle - Math.PI / 2;
			const a1 = a0 + angle;
			const r = (Math.sqrt(d.value / max) || 0.05) * rMax; // area ∝ value
			const x0 = c + r * Math.cos(a0);
			const y0 = c + r * Math.sin(a0);
			const x1 = c + r * Math.cos(a1);
			const y1 = c + r * Math.sin(a1);
			return {
				d: `M${c},${c} L${x0.toFixed(1)},${y0.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`,
				label: `${d.label}: ${d.value}`,
				cls: palette[i % palette.length],
			};
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
				aria-label="Polar area chart"
			>
				<For each={wedges()}>
					{(w) => (
						<path
							d={w.d}
							fill="currentColor"
							class={w.cls}
							opacity="0.75"
							stroke="var(--color-surface)"
							stroke-width="1"
						>
							<title>{w.label}</title>
						</path>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
