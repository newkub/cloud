/** Diagram node/edge model and the layered (longest-path) DAG layout. */

export type DiagramShape = "rect" | "rounded" | "pill" | "diamond" | "circle";
export type DiagramTone = "default" | "primary" | "success" | "warning" | "destructive" | "info" | "muted";
export type DiagramDirection = "tb" | "lr";

export interface DiagramNode {
	id: string;
	label: string;
	shape?: DiagramShape;
	tone?: DiagramTone;
}

export interface DiagramEdge {
	from: string;
	to: string;
	label?: string;
	dashed?: boolean;
}

export const NODE_W = 112;
export const NODE_H = 40;
export const GAP_X = 56;
export const GAP_Y = 64;
const PAD = 16;

export interface Placed extends DiagramNode {
	x: number;
	y: number;
	w: number;
	h: number;
}

function nodeSize(n: DiagramNode): { w: number; h: number } {
	const w = Math.max(NODE_W, n.label.length * 7 + 32);
	return { w, h: n.shape === "circle" ? Math.max(NODE_H, w * 0.6) : NODE_H };
}

/** Longest-path layering for a DAG; cycles degrade gracefully to depth 0. */
export function layerLayout(
	nodes: DiagramNode[],
	edges: DiagramEdge[],
	direction: DiagramDirection = "tb",
): { placed: Placed[]; width: number; height: number } {
	const incoming = new Map<string, string[]>();
	for (const e of edges) {
		const list = incoming.get(e.to) ?? [];
		list.push(e.from);
		incoming.set(e.to, list);
	}
	const depth = new Map<string, number>();
	const visiting = new Set<string>();
	const depthOf = (id: string): number => {
		if (depth.has(id)) return depth.get(id) ?? 0;
		if (visiting.has(id)) return 0;
		visiting.add(id);
		const parents = incoming.get(id) ?? [];
		const d = parents.length ? Math.max(...parents.map(depthOf)) + 1 : 0;
		visiting.delete(id);
		depth.set(id, d);
		return d;
	};

	const layers = new Map<number, DiagramNode[]>();
	for (const n of nodes) {
		const d = depthOf(n.id);
		const list = layers.get(d) ?? [];
		list.push(n);
		layers.set(d, list);
	}

	const placed: Placed[] = [];
	for (const [d, layerNodes] of layers) {
		const sizes = layerNodes.map(nodeSize);
		const main = direction === "tb" ? Math.max(...sizes.map((s) => s.h)) : Math.max(...sizes.map((s) => s.w));
		const crossTotal = sizes.reduce((a, s) => a + (direction === "tb" ? s.w : s.h), 0);
		const crossGap = direction === "tb" ? GAP_X : GAP_Y;
		let cross = -(crossTotal + crossGap * (layerNodes.length - 1)) / 2;
		for (const [i, n] of layerNodes.entries()) {
			const { w, h } = sizes[i];
			const x = direction === "tb" ? cross : d * (main + GAP_X);
			const y = direction === "tb" ? d * (main + GAP_Y) : cross;
			placed.push({ ...n, x, y, w, h });
			cross += (direction === "tb" ? w : h) + crossGap;
		}
	}

	const minX = Math.min(...placed.map((p) => p.x), 0);
	const minY = Math.min(...placed.map((p) => p.y), 0);
	for (const p of placed) {
		p.x = p.x - minX + PAD;
		p.y = p.y - minY + PAD;
	}
	const width = Math.max(...placed.map((p) => p.x + p.w), 0) + PAD;
	const height = Math.max(...placed.map((p) => p.y + p.h), 0) + PAD;
	return { placed, width, height };
}
