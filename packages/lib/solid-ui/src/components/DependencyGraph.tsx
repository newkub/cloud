/**
 * DependencyGraph — left-to-right layered DAG with bezier edges and arrowheads.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface DependencyNode {
	/** Unique id referenced by edges. */
	id: string;
	/** Display label. */
	label: string;
	/** Explicit layer (column) index — computed from edges when omitted. */
	layer?: number;
}

export interface DependencyEdge {
	/** Source node id (dependency). */
	from: string;
	/** Target node id (dependent). */
	to: string;
}

export interface DependencyGraphProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** DAG nodes — auto-layered left to right by dependency depth. */
	nodes: DependencyNode[];
	/** Directed edges between node ids. */
	edges: DependencyEdge[];
	/** Canvas density. @default "md" */
	size?: "sm" | "md" | "lg";
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;

const NODE_W = 132;
const NODE_H = 44;
const GAP_X = 72;
const GAP_Y = 20;
const PAD = 16;

let markerSeq = 0;

interface Placed extends DependencyNode {
	x: number;
	y: number;
}

export function DependencyGraph(props: DependencyGraphProps) {
	const [local, rest] = splitProps(props, ["class", "nodes", "edges", "size", "aria-label"]);
	const markerId = `solidui-dep-arrow-${++markerSeq}`;

	const nodes = () => local.nodes ?? [];
	const edges = () => local.edges ?? [];

	/** Longest-path layering; explicit `layer` wins, cycles degrade to depth 0. */
	const layers = () => {
		const incoming = new Map<string, string[]>();
		for (const e of edges()) {
			const list = incoming.get(e.to) ?? [];
			list.push(e.from);
			incoming.set(e.to, list);
		}
		const memo = new Map<string, number>();
		const visiting = new Set<string>();
		const depthOf = (id: string): number => {
			if (memo.has(id)) return memo.get(id) ?? 0;
			if (visiting.has(id)) return 0;
			visiting.add(id);
			const parents = incoming.get(id) ?? [];
			const d = parents.length ? Math.max(...parents.map(depthOf)) + 1 : 0;
			visiting.delete(id);
			memo.set(id, d);
			return d;
		};
		const map = new Map<number, DependencyNode[]>();
		for (const n of nodes()) {
			const d = n.layer ?? depthOf(n.id);
			const list = map.get(d) ?? [];
			list.push(n);
			map.set(d, list);
		}
		return map;
	};

	const layout = () => {
		const map = layers();
		const maxRows = Math.max(...[...map.values()].map((l) => l.length), 1);
		const height = maxRows * NODE_H + (maxRows - 1) * GAP_Y + PAD * 2;
		const placed: Placed[] = [];
		let maxLayer = 0;
		for (const [d, list] of map) {
			maxLayer = Math.max(maxLayer, d);
			const colH = list.length * NODE_H + (list.length - 1) * GAP_Y;
			let y = (height - colH) / 2;
			for (const n of list) {
				placed.push({ ...n, x: PAD + d * (NODE_W + GAP_X), y });
				y += NODE_H + GAP_Y;
			}
		}
		return { placed, width: PAD * 2 + (maxLayer + 1) * NODE_W + maxLayer * GAP_X, height };
	};

	const byId = () => new Map(layout().placed.map((p) => [p.id, p]));
	const label = () => local["aria-label"] ?? `Dependency graph: ${nodes().length} nodes, ${edges().length} edges`;

	const edgePath = (e: DependencyEdge) => {
		const a = byId().get(e.from);
		const b = byId().get(e.to);
		if (!a || !b) return null;
		const sx = a.x + NODE_W;
		const sy = a.y + NODE_H / 2;
		const tx = b.x;
		const ty = b.y + NODE_H / 2;
		const mx = (sx + tx) / 2;
		return `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`;
	};

	return (
		<div class={`solidui-dependency-graph ${sizeClass[local.size ?? "md"]} ${local.class ?? ""}`.trim()} {...rest}>
			<svg viewBox={`0 0 ${layout().width} ${layout().height}`} class="h-auto w-full" role="img" aria-label={label()}>
				<title>{label()}</title>
				<defs>
					<marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
						<path d="M 0 0 L 8 4 L 0 8 z" class="fill-muted-foreground" />
					</marker>
				</defs>
				<For each={edges()}>
					{(e) => (
						<Show when={edgePath(e)}>
							<path
								d={edgePath(e) ?? ""}
								fill="none"
								class="stroke-muted-foreground"
								stroke-width="1.5"
								marker-end={`url(#${markerId})`}
							/>
						</Show>
					)}
				</For>
				<For each={layout().placed}>
					{(n) => (
						<g>
							<rect
								x={n.x}
								y={n.y}
								width={NODE_W}
								height={NODE_H}
								rx={8}
								class="fill-surface stroke-border"
								stroke-width="1.5"
							/>
							<text
								x={n.x + NODE_W / 2}
								y={n.y + NODE_H / 2}
								dy="0.35em"
								text-anchor="middle"
								class="fill-foreground"
								font-size="11"
							>
								{n.label}
							</text>
						</g>
					)}
				</For>
			</svg>
		</div>
	);
}
