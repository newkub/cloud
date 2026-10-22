/**
 * NetworkGraph — node/edge SVG graph with optional circle auto-layout, directed arrows, and selectable nodes.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface NetworkNode {
	/** Unique id referenced by edges. */
	id: string;
	/** Display label. */
	label: string;
	/** X coordinate — provided coordinates are normalized into the canvas. */
	x?: number;
	/** Y coordinate — provided coordinates are normalized into the canvas. */
	y?: number;
}

export interface NetworkEdge {
	/** Source node id. */
	from: string;
	/** Target node id. */
	to: string;
	/** Label rendered at the edge midpoint. */
	label?: string;
}

export interface NetworkGraphProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Graph nodes — nodes without x/y fall back to a circle layout. */
	nodes: NetworkNode[];
	/** Connections between node ids. */
	edges: NetworkEdge[];
	/** Draw arrowheads on edges. @default false */
	directed?: boolean;
	/** Canvas density. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Id of the currently selected node. */
	selected?: string;
	/** Called with the node id when a node is clicked or activated via keyboard. */
	onNodeClick?: (id: string) => void;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;

const W = 560;
const H = 360;
const PAD = 56;
const NODE_R = 26;

let markerSeq = 0;

interface Placed extends NetworkNode {
	px: number;
	py: number;
}

export function NetworkGraph(props: NetworkGraphProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"nodes",
		"edges",
		"directed",
		"size",
		"selected",
		"onNodeClick",
		"aria-label",
	]);
	const markerId = `solidui-network-arrow-${++markerSeq}`;

	const nodes = () => local.nodes ?? [];
	const edges = () => local.edges ?? [];

	const placed = (): Placed[] => {
		const list = nodes();
		const cx = W / 2;
		const cy = H / 2;
		const cr = Math.min(W, H) / 2 - PAD;
		const manual = list.filter((n) => n.x !== undefined && n.y !== undefined);
		const xs = manual.map((n) => n.x ?? 0);
		const ys = manual.map((n) => n.y ?? 0);
		const minX = manual.length ? Math.min(...xs) : 0;
		const maxX = manual.length ? Math.max(...xs) : 1;
		const minY = manual.length ? Math.min(...ys) : 0;
		const maxY = manual.length ? Math.max(...ys) : 1;
		let auto = 0;
		return list.map((n) => {
			if (n.x !== undefined && n.y !== undefined) {
				return {
					...n,
					px: maxX === minX ? cx : PAD + ((n.x - minX) / (maxX - minX)) * (W - 2 * PAD),
					py: maxY === minY ? cy : PAD + ((n.y - minY) / (maxY - minY)) * (H - 2 * PAD),
				};
			}
			const a = (auto++ / Math.max(list.length - manual.length, 1)) * Math.PI * 2 - Math.PI / 2;
			return { ...n, px: cx + cr * Math.cos(a), py: cy + cr * Math.sin(a) };
		});
	};

	const byId = () => new Map(placed().map((p) => [p.id, p]));
	const interactive = () => local.onNodeClick !== undefined;
	const label = () => local["aria-label"] ?? `Network graph: ${nodes().length} nodes, ${edges().length} edges`;

	const edgeEnds = (e: NetworkEdge) => {
		const a = byId().get(e.from);
		const b = byId().get(e.to);
		if (!a || !b) return null;
		const dx = b.px - a.px;
		const dy = b.py - a.py;
		const len = Math.hypot(dx, dy) || 1;
		return {
			sx: a.px + (dx / len) * NODE_R,
			sy: a.py + (dy / len) * NODE_R,
			tx: b.px - (dx / len) * (NODE_R + (local.directed ? 4 : 0)),
			ty: b.py - (dy / len) * (NODE_R + (local.directed ? 4 : 0)),
			mx: (a.px + b.px) / 2,
			my: (a.py + b.py) / 2,
		};
	};

	const activate = (id: string) => local.onNodeClick?.(id);
	const onKey = (e: KeyboardEvent, id: string) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			activate(id);
		}
	};

	return (
		<div class={`solidui-network-graph ${sizeClass[local.size ?? "md"]} ${local.class ?? ""}`.trim()} {...rest}>
			<svg viewBox={`0 0 ${W} ${H}`} class="h-auto w-full" role="img" aria-label={label()}>
				<title>{label()}</title>
				<Show when={local.directed}>
					<defs>
						<marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
							<path d="M 0 0 L 8 4 L 0 8 z" class="fill-muted-foreground" />
						</marker>
					</defs>
				</Show>
				<For each={edges()}>
					{(e) => {
						const g = () => edgeEnds(e);
						return (
							<Show when={g()}>
								<g>
									<line
										x1={g()?.sx}
										y1={g()?.sy}
										x2={g()?.tx}
										y2={g()?.ty}
										class="stroke-muted-foreground"
										stroke-width="1.5"
										marker-end={local.directed ? `url(#${markerId})` : undefined}
									/>
									<Show when={e.label}>
										<text
											x={g()?.mx}
											y={(g()?.my ?? 0) - 5}
											text-anchor="middle"
											class="fill-muted-foreground"
											font-size="10"
										>
											{e.label}
										</text>
									</Show>
								</g>
							</Show>
						);
					}}
				</For>
				<For each={placed()}>
					{(n) => {
						const sel = () => local.selected === n.id;
						return (
							// biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useAriaPropsSupportedByRole: role/pressed applied only when clickable
							<g
								role={interactive() ? "button" : undefined}
								tabindex={interactive() ? 0 : undefined}
								aria-pressed={interactive() ? sel() : undefined}
								class={interactive() ? "group cursor-pointer outline-none" : ""}
								onClick={() => interactive() && activate(n.id)}
								onKeyDown={(e) => interactive() && onKey(e, n.id)}
							>
								<circle
									cx={n.px}
									cy={n.py}
									r={NODE_R}
									stroke-width={sel() ? 2 : 1.5}
									class={`motion-reduce:transition-none transition-colors ${sel() ? "fill-primary/10 stroke-primary" : "fill-surface stroke-border"} ${
										interactive()
											? "group-hover:stroke-primary/60 group-focus-visible:stroke-primary group-focus-visible:stroke-2"
											: ""
									}`}
								/>
								<text
									x={n.px}
									y={n.py}
									dy="0.35em"
									text-anchor="middle"
									class={sel() ? "fill-primary" : "fill-foreground"}
									font-size="11"
								>
									{n.label}
								</text>
							</g>
						);
					}}
				</For>
			</svg>
		</div>
	);
}
