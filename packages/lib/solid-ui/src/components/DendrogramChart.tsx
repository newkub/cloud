/**
 * DendrogramChart — hierarchy as elbow-linked tree (phylogenetic/cluster style).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DendrogramNode {
	label: string;
	children?: DendrogramNode[];
}

export interface DendrogramChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: DendrogramNode;
	width?: number;
	/** Row height per leaf. @default 22 */
	leafHeight?: number;
	radius?: Radius;
	elevation?: Elevation;
}

interface Placed {
	label: string;
	x: number;
	y: number;
	parent?: { x: number; y: number };
}

export function DendrogramChart(props: DendrogramChartProps) {
	const merged = mergeProps({ width: 400, leafHeight: 22 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "width", "leafHeight", "radius", "elevation"]);

	const view = () => {
		const out: Placed[] = [];
		const maxDepth = (n: DendrogramNode): number => 1 + Math.max(0, ...(n.children ?? []).map(maxDepth));
		const depth = local.data ? maxDepth(local.data) : 1;
		const levelW = (local.width - 80) / Math.max(1, depth);
		let leaf = 0;
		const walk = (n: DendrogramNode, d: number, parent?: { x: number; y: number }): number => {
			const kids = n.children ?? [];
			let y: number;
			if (!kids.length) y = 12 + leaf++ * local.leafHeight;
			else {
				const ys = kids.map((k) => walk(k, d + 1));
				y = (ys[0] + ys[ys.length - 1]) / 2;
			}
			out.push({ label: n.label, x: 12 + d * levelW, y, parent });
			return y;
		};
		if (local.data) walk(local.data, 0);
		return { nodes: out, height: Math.max(40, 12 + leaf * local.leafHeight) };
	};

	return (
		<div
			class={[
				"w-full overflow-x-auto",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="w-full" viewBox={`0 0 ${local.width} ${view().height}`} role="img" aria-label="Dendrogram">
				<For each={view().nodes}>
					{(n) => (
						<g>
							{n.parent && (
								<path
									d={`M${n.parent.x},${n.parent.y} H${(n.parent.x + n.x) / 2} V${n.y} H${n.x - 5}`}
									fill="none"
									stroke="currentColor"
									class="text-border"
								/>
							)}
							<circle cx={n.x - 3} cy={n.y} r="2.5" fill="currentColor" class="text-primary" />
							<text x={n.x + 2} y={n.y + 3} font-size="9" class="fill-foreground">
								{n.label}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
