/**
 * ArchDiagram — architecture boxes (HTML grid) with bezier arrows (SVG overlay), horizontal or vertical.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface ArchNode {
	/** Unique id referenced by edges. */
	id: string;
	/** Box title. */
	label: string;
	/** Secondary description line. */
	desc?: string;
	/** Leading icon element. */
	icon?: JSX.Element;
}

export interface ArchEdge {
	/** Source node id. */
	from: string;
	/** Target node id. */
	to: string;
	/** Label rendered at the edge midpoint. */
	label?: string;
}

export interface ArchDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Boxes to place — auto-layered by dependency depth along the main axis. */
	nodes: ArchNode[];
	/** Directed edges between node ids. */
	edges: ArchEdge[];
	/** Main axis direction. @default "horizontal" */
	direction?: "horizontal" | "vertical";
	/** Canvas density. @default "md" */
	size?: "sm" | "md" | "lg";
}

const sizeClass = { sm: "max-w-sm", md: "max-w-2xl", lg: "max-w-4xl" } as const;

let markerSeq = 0;

interface Cell extends ArchNode {
	col: number;
	row: number;
}

export function ArchDiagram(props: ArchDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "nodes", "edges", "direction", "size", "aria-label"]);
	const markerId = `solidui-arch-arrow-${++markerSeq}`;

	const nodes = () => local.nodes ?? [];
	const edges = () => local.edges ?? [];
	const horizontal = () => (local.direction ?? "horizontal") === "horizontal";

	/** Longest-path layering; cycles degrade to depth 0. */
	const depthOf = (() => {
		const memo = new Map<string, number>();
		const visiting = new Set<string>();
		const fn = (id: string, incoming: Map<string, string[]>): number => {
			if (memo.has(id)) return memo.get(id) ?? 0;
			if (visiting.has(id)) return 0;
			visiting.add(id);
			const parents = incoming.get(id) ?? [];
			const d = parents.length ? Math.max(...parents.map((p) => fn(p, incoming))) + 1 : 0;
			visiting.delete(id);
			memo.set(id, d);
			return d;
		};
		return fn;
	})();

	const layout = () => {
		const incoming = new Map<string, string[]>();
		for (const e of edges()) {
			const list = incoming.get(e.to) ?? [];
			list.push(e.from);
			incoming.set(e.to, list);
		}
		const byLayer = new Map<number, ArchNode[]>();
		for (const n of nodes()) {
			const d = depthOf(n.id, incoming);
			const list = byLayer.get(d) ?? [];
			list.push(n);
			byLayer.set(d, list);
		}
		const nLayers = Math.max(...byLayer.keys(), 0) + 1;
		const maxSize = Math.max(...[...byLayer.values()].map((l) => l.length), 1);
		const cells: Cell[] = [];
		for (const [d, list] of byLayer) {
			for (const [i, n] of list.entries()) {
				cells.push(horizontal() ? { ...n, col: d, row: i } : { ...n, col: i, row: d });
			}
		}
		return {
			cells,
			nCols: horizontal() ? nLayers : maxSize,
			nRows: horizontal() ? maxSize : nLayers,
		};
	};

	const pos = () => {
		const { nCols, nRows } = layout();
		return new Map(layout().cells.map((c) => [c.id, { fx: (c.col + 0.5) / nCols, fy: (c.row + 0.5) / nRows }]));
	};

	const edgeGeo = (e: ArchEdge) => {
		const a = pos().get(e.from);
		const b = pos().get(e.to);
		if (!a || !b) return null;
		const sx = a.fx * 100;
		const sy = a.fy * 100;
		const tx = b.fx * 100;
		const ty = b.fy * 100;
		const d = horizontal()
			? `M ${sx} ${sy} C ${(sx + tx) / 2} ${sy}, ${(sx + tx) / 2} ${ty}, ${tx} ${ty}`
			: `M ${sx} ${sy} C ${sx} ${(sy + ty) / 2}, ${tx} ${(sy + ty) / 2}, ${tx} ${ty}`;
		return { d, mx: (a.fx + b.fx) / 2, my: (a.fy + b.fy) / 2 };
	};

	const label = () =>
		local["aria-label"] ?? `Architecture diagram: ${nodes().length} components, ${edges().length} connections`;

	return (
		<div class={`solidui-arch-diagram ${sizeClass[local.size ?? "md"]} ${local.class ?? ""}`.trim()} {...rest}>
			<div class="relative" role="img" aria-label={label()}>
				<svg
					class="pointer-events-none absolute inset-0 h-full w-full"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<defs>
						<marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
							<path d="M 0 0 L 8 4 L 0 8 z" class="fill-muted-foreground" />
						</marker>
					</defs>
					<For each={edges()}>
						{(e) => (
							<Show when={edgeGeo(e)}>
								<path
									d={edgeGeo(e)?.d ?? ""}
									fill="none"
									class="stroke-muted-foreground"
									stroke-width="1.5"
									vector-effect="non-scaling-stroke"
									marker-end={`url(#${markerId})`}
								/>
							</Show>
						)}
					</For>
				</svg>
				<For each={edges()}>
					{(e) => (
						<Show when={e.label && edgeGeo(e)}>
							<span
								class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded bg-surface px-1 text-2xs text-muted-foreground"
								style={{ left: `${(edgeGeo(e)?.mx ?? 0) * 100}%`, top: `${(edgeGeo(e)?.my ?? 0) * 100}%` }}
							>
								{e.label}
							</span>
						</Show>
					)}
				</For>
				<div
					class="relative grid gap-6"
					style={{
						"grid-template-columns": `repeat(${layout().nCols}, minmax(0, 1fr))`,
						"grid-template-rows": `repeat(${layout().nRows}, auto)`,
					}}
				>
					<For each={layout().cells}>
						{(n) => (
							<div
								class="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 shadow-sm"
								style={{
									"grid-column": String(n.col + 1),
									"grid-row": String(n.row + 1),
									"place-self": "center",
									"min-width": "0",
								}}
							>
								<Show when={n.icon}>
									<span class="shrink-0 text-primary">{n.icon}</span>
								</Show>
								<div class="min-w-0">
									<div class="truncate font-medium text-foreground text-sm">{n.label}</div>
									<Show when={n.desc}>
										<div class="truncate text-muted-foreground text-xs">{n.desc}</div>
									</Show>
								</div>
							</div>
						)}
					</For>
				</div>
			</div>
		</div>
	);
}
