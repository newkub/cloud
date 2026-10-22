/**
 * AlluvialDiagram — categorical flows between stages (Sankey-like, axis-aligned bands).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface AlluvialStage {
	label: string;
	nodes: { label: string; value: number }[];
}

export interface AlluvialLink {
	/** [stageIndex, nodeIndex] */
	from: [number, number];
	to: [number, number];
	value: number;
}

export interface AlluvialDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	stages?: AlluvialStage[];
	links?: AlluvialLink[];
	width?: number;
	height?: number;
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

export function AlluvialDiagram(props: AlluvialDiagramProps) {
	const merged = mergeProps({ width: 420, height: 200 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"stages",
		"links",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const view = () => {
		const stages = local.stages ?? [];
		const n = stages.length;
		const pad = 8;
		const labelW = 12;
		const stageW = (local.width - pad * 2) / Math.max(1, n);
		// vertical slot per node within its stage
		const pos = new Map<string, { x: number; y: number; h: number; label: string }>();
		stages.forEach((s, si) => {
			const total = Math.max(
				1e-9,
				s.nodes.reduce((a, nd) => a + nd.value, 0),
			);
			let y = 20;
			const innerH = local.height - 44;
			s.nodes.forEach((nd, ni) => {
				const h = (nd.value / total) * innerH;
				pos.set(`${si},${ni}`, { x: pad + si * stageW + labelW, y, h, label: nd.label });
				y += h + 4;
			});
		});
		const links = (local.links ?? []).map((l) => {
			const a = pos.get(`${l.from[0]},${l.from[1]}`);
			const b = pos.get(`${l.to[0]},${l.to[1]}`);
			if (!a || !b) return null;
			const h = Math.min(a.h, b.h) * Math.min(1, l.value / Math.max(a.h, b.h));
			const x0 = a.x + stageW - labelW - 4;
			const x1 = b.x;
			return {
				d: `M${x0},${a.y} C${x0 + stageW / 3},${a.y} ${x1 - stageW / 3},${b.y} ${x1},${b.y} L${x1},${b.y + h} C${x1 - stageW / 3},${b.y + h} ${x0 + stageW / 3},${a.y + h} ${x0},${a.y + h} Z`,
				cls: palette[l.from[1] % palette.length],
			};
		});
		return { pos, links: links.filter(Boolean) as { d: string; cls: string }[], stageW };
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
			<svg class="w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Alluvial diagram">
				<For each={view().links}>{(l) => <path d={l.d} fill="currentColor" class={l.cls} opacity="0.3" />}</For>
				<For each={local.stages ?? []}>
					{(s, si) => (
						<g>
							<text x={8 + si() * view().stageW + 12} y={12} font-size="9" class="fill-muted-foreground font-semibold">
								{s.label}
							</text>
							<For each={s.nodes}>
								{(nd, ni) => {
									const p = view().pos.get(`${si},${ni()}`);
									if (!p) return null;
									return (
										<rect
											x={p.x + view().stageW - 16}
											y={p.y}
											width="8"
											height={Math.max(2, p.h)}
											rx="2"
											fill="currentColor"
											class={palette[ni() % palette.length]}
										>
											<title>{nd.label}</title>
										</rect>
									);
								}}
							</For>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
