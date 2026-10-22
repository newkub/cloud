/**
 * ArcDiagram — nodes on a baseline with semicircular arcs for links.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ArcDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	nodes?: string[];
	/** Links as [sourceIndex, targetIndex, weight?]. */
	links?: [number, number, number?][];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function ArcDiagram(props: ArcDiagramProps) {
	const merged = mergeProps({ width: 420, height: 140 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"nodes",
		"links",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const view = () => {
		const nodes = local.nodes ?? [];
		const n = Math.max(1, nodes.length);
		const pad = 40;
		const base = local.height - 20;
		const x = (i: number) => pad + (i / Math.max(1, n - 1)) * (local.width - pad * 2);
		const arcs = (local.links ?? []).map(([s, t, w]) => {
			const x0 = x(s);
			const x1 = x(t);
			const r = Math.abs(x1 - x0) / 2;
			return {
				d: `M${x0},${base} A${r},${r} 0 0 1 ${x1},${base}`,
				w: Math.max(1, w ?? 1),
			};
		});
		return { arcs, x, base, nodes };
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
			<svg class="w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Arc diagram">
				<For each={view().arcs}>
					{(a) => (
						<path d={a.d} fill="none" stroke="currentColor" class="text-primary" stroke-width={a.w} opacity="0.5" />
					)}
				</For>
				<For each={view().nodes}>
					{(name, i) => (
						<g>
							<circle cx={view().x(i())} cy={view().base} r="4" fill="currentColor" class="text-primary" />
							<text
								x={view().x(i())}
								y={view().base + 12}
								text-anchor="middle"
								font-size="8"
								class="fill-muted-foreground"
							>
								{name}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
