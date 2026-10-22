/**
 * SunburstChart — nested radial partition for hierarchical data.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface SunburstNode {
	label: string;
	value?: number;
	children?: SunburstNode[];
}

export interface SunburstChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: SunburstNode[];
	size?: number;
	/** Max ring depth. @default 3 */
	depth?: number;
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
const polar = (c: number, r: number, a: number) =>
	`${(c + r * Math.cos(a)).toFixed(1)},${(c + r * Math.sin(a)).toFixed(1)}`;
const ring = (c: number, r0: number, r1: number, a0: number, a1: number) => {
	const large = a1 - a0 > Math.PI ? 1 : 0;
	return `M${polar(c, r1, a0)} A${r1},${r1} 0 ${large} 1 ${polar(c, r1, a1)} L${polar(c, r0, a1)} A${r0},${r0} 0 ${large} 0 ${polar(c, r0, a0)} Z`;
};
const nodeTotal = (n: SunburstNode): number => n.value ?? (n.children ?? []).reduce((a, ch) => a + nodeTotal(ch), 0);

export function SunburstChart(props: SunburstChartProps) {
	const merged = mergeProps({ size: 220, depth: 3 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "size", "depth", "radius", "elevation"]);

	const slices = () => {
		const c = local.size / 2;
		const band = (c - 8) / local.depth;
		const out: { d: string; cls: string; label: string }[] = [];
		const walk = (nodes: SunburstNode[], depth: number, a0: number, a1: number, hue: number) => {
			if (depth >= local.depth) return;
			const total = Math.max(
				1e-9,
				nodes.reduce((a, n) => a + nodeTotal(n), 0),
			);
			let a = a0;
			for (const n of nodes) {
				const span = ((a1 - a0) * nodeTotal(n)) / total;
				out.push({
					d: ring(c, 8 + depth * band, 8 + (depth + 1) * band - 2, a, a + span),
					cls: palette[(hue + depth) % palette.length],
					label: `${n.label}: ${nodeTotal(n)}`,
				});
				if (n.children) walk(n.children, depth + 1, a, a + span, hue + 1);
				a += span;
			}
		};
		walk(local.data ?? [], 0, -Math.PI / 2, Math.PI * 1.5, 0);
		return out;
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
				aria-label="Sunburst chart"
			>
				<For each={slices()}>
					{(s) => (
						<path d={s.d} fill="currentColor" class={s.cls} opacity="0.8" stroke="var(--color-surface)">
							<title>{s.label}</title>
						</path>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
