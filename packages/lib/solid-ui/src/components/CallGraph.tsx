/**
 * CallGraph — layered caller→callee hierarchy with curved arrows.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CallNode {
	id: string;
	label: string;
	/** Callees by node id. */
	calls?: string[];
}

export interface CallGraphProps extends JSX.HTMLAttributes<HTMLDivElement> {
	root?: CallNode;
	/** Flat lookup for `calls` references. */
	nodes?: Record<string, CallNode>;
	width?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function CallGraph(props: CallGraphProps) {
	const merged = mergeProps({ width: 420 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "root", "nodes", "width", "radius", "elevation"]);

	/** Breadth-first layering: depth = distance from root; nodes centered per row. */
	const view = () => {
		const find = (id: string) => (local.root?.id === id ? local.root : local.nodes?.[id]);
		const levels = new Map<string, number>();
		const edges: [string, string][] = [];
		const queue = local.root ? [local.root.id] : [];
		if (local.root) levels.set(local.root.id, 0);
		while (queue.length) {
			const id = queue.shift();
			if (id === undefined) break;
			const node = find(id);
			if (!node) continue;
			const d = levels.get(id) ?? 0;
			for (const cid of node.calls ?? []) {
				edges.push([id, cid]);
				if (!levels.has(cid)) {
					levels.set(cid, d + 1);
					queue.push(cid);
				}
			}
		}
		const rows = new Map<number, string[]>();
		for (const [id, d] of levels) rows.set(d, [...(rows.get(d) ?? []), id]);
		const pos = new Map<string, { x: number; y: number; label: string }>();
		let maxDepth = 0;
		for (const [d, ids] of rows) {
			maxDepth = Math.max(maxDepth, d);
			ids.forEach((id, i) => {
				pos.set(id, {
					x: 20 + ((local.width - 40) / Math.max(1, ids.length)) * (i + 0.5),
					y: d * 56 + 24,
					label: find(id)?.label ?? id,
				});
			});
		}
		return { pos, edges, height: (maxDepth + 1) * 56 + 8 };
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
			<svg class="w-full" viewBox={`0 0 ${local.width} ${view().height}`} role="img" aria-label="Call graph">
				<defs>
					<marker id="cg-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
						<path d="M0,0 L6,3 L0,6 Z" fill="currentColor" class="text-muted-foreground" />
					</marker>
				</defs>
				<For each={view().edges}>
					{([s, t]) => {
						const a = view().pos.get(s);
						const b = view().pos.get(t);
						if (!a || !b) return null;
						const mid = (a.y + b.y) / 2;
						return (
							<path
								d={`M${a.x},${a.y + 10} C${a.x},${mid} ${b.x},${mid} ${b.x},${b.y - 10}`}
								fill="none"
								stroke="currentColor"
								class="text-border"
								marker-end="url(#cg-arrow)"
							/>
						);
					}}
				</For>
				<For each={[...view().pos.values()]}>
					{(p) => (
						<g>
							<rect
								x={p.x - 34}
								y={p.y - 11}
								width="68"
								height="22"
								rx="6"
								fill="var(--color-surface)"
								stroke="currentColor"
								class="text-primary"
							/>
							<text x={p.x} y={p.y + 3} text-anchor="middle" font-size="9" class="fill-foreground font-medium">
								{p.label}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
