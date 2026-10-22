/**
 * Mermaid-subset parser — `graph`/`flowchart`/`sequenceDiagram` into diagram data.
 */
import type { DiagramDirection, DiagramEdge, DiagramNode, DiagramShape } from "./diagram";

export type ParsedDiagram =
	| { kind: "flow"; direction: DiagramDirection; nodes: DiagramNode[]; edges: DiagramEdge[] }
	| { kind: "sequence"; actors: string[]; messages: { from: string; to: string; label: string; dashed: boolean }[] };

const MERMAID_SHAPES: [RegExp, DiagramShape][] = [
	[/^\(\((.*)\)\)$/, "circle"],
	[/^\((.*)\)$/, "pill"],
	[/^\{(.*)\}$/, "diamond"],
	[/^\[(.*)\]$/, "rect"],
];

function mermaidNode(raw: string, nodes: Map<string, DiagramNode>): string {
	const m = raw.trim().match(/^([\w-]+)\s*(\(\(.+\)\)|\(.+\)|\{.+}|\[.+])?$/);
	if (!m) return raw.trim();
	const [, id, wrap] = m;
	if (!nodes.has(id)) nodes.set(id, { id, label: id });
	if (wrap) {
		const node = nodes.get(id) as DiagramNode;
		for (const [re, shape] of MERMAID_SHAPES) {
			const wm = wrap.match(re);
			if (wm) {
				node.shape = shape;
				node.label = wm[1];
				break;
			}
		}
	}
	return id;
}

/** Parse a Mermaid `graph`/`flowchart`/`sequenceDiagram` subset into diagram data. */
export function parseMermaid(code: string): ParsedDiagram | null {
	const lines = code
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l && !l.startsWith("%%"));
	const head = lines[0] ?? "";
	if (/^(graph|flowchart)\s+(TB|TD|BT|LR|RL)/i.test(head)) {
		const dir = /LR|RL/i.test(head) ? "lr" : "tb";
		const nodes = new Map<string, DiagramNode>();
		const edges: DiagramEdge[] = [];
		for (const line of lines.slice(1)) {
			// Split chains: "A-->B-->C" — iterate arrows.
			const arrowRe = /([-\w()[\]{}.]+?)\s*(--?>|--?\.\s*--?>|==>)(?:\s*\|([^|]*)\|)?\s*([-\w()[\]{}.]+)/g;
			let m: RegExpExecArray | null;
			let matched = false;
			// biome-ignore lint/suspicious/noAssignInExpressions: regex exec loop
			while ((m = arrowRe.exec(line))) {
				matched = true;
				const from = mermaidNode(m[1], nodes);
				const to = mermaidNode(m[4], nodes);
				edges.push({ from, to, label: m[3]?.trim() || undefined, dashed: m[2].includes(".") });
			}
			if (!matched && /^\w+/.test(line)) mermaidNode(line, nodes);
		}
		if (nodes.size === 0) return null;
		if (/RL|BT/i.test(head)) edges.reverse();
		return { kind: "flow", direction: dir, nodes: [...nodes.values()], edges };
	}
	if (/^sequenceDiagram/i.test(head)) {
		const actors: string[] = [];
		const messages: { from: string; to: string; label: string; dashed: boolean }[] = [];
		const pushActor = (name: string) => {
			if (!actors.includes(name)) actors.push(name);
		};
		for (const line of lines.slice(1)) {
			const pm = line.match(/^participant\s+(\w+)(?:\s+as\s+(.+))?/i);
			if (pm) {
				pushActor(pm[1]);
				continue;
			}
			const mm = line.match(/^(\w+)\s*(--?>>?)\s*(\w+)\s*:?\s*(.*)$/);
			if (mm) {
				pushActor(mm[1]);
				pushActor(mm[3]);
				messages.push({ from: mm[1], to: mm[3], label: mm[4].trim(), dashed: mm[2].startsWith("--") });
			}
		}
		return actors.length ? { kind: "sequence", actors, messages } : null;
	}
	return null;
}
