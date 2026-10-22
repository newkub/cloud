/**
 * RadialTree — root node at the center with children radiating outward in concentric rings.
 */
import { For, type JSX, splitProps } from "solid-js";

export interface RadialTreeNode {
	/** Display label. */
	label: string;
	/** Nested children occupy the next ring out, inside their parent's sector. */
	children?: RadialTreeNode[];
}

export interface RadialTreeProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Root node rendered at the center. */
	root?: RadialTreeNode;
	/** Canvas density. @default "md" */
	size?: "sm" | "md" | "lg";
}

const sizeClass = { sm: "max-w-xs", md: "max-w-md", lg: "max-w-xl" } as const;

const W = 480;
const H = 480;
const CX = W / 2;
const CY = H / 2;
const MAX_R = 216;

interface Placed extends RadialTreeNode {
	x: number;
	y: number;
	depth: number;
}

interface RadialEdge {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

function leafCount(n: RadialTreeNode): number {
	if (!n.children?.length) return 1;
	return (n.children ?? []).reduce((a, c) => a + leafCount(c), 0);
}

function maxDepth(n: RadialTreeNode, d = 0): number {
	return Math.max(d, ...(n.children ?? []).map((c) => maxDepth(c, d + 1)));
}

export function RadialTree(props: RadialTreeProps) {
	const [local, rest] = splitProps(props, ["class", "root", "size", "aria-label"]);

	const layout = () => {
		if (!local.root) return { placed: [] as Placed[], edges: [] as RadialEdge[] };
		const ring = Math.max(maxDepth(local.root), 1) > 0 ? MAX_R / Math.max(maxDepth(local.root), 1) : 0;
		const placed: Placed[] = [];
		const edges: RadialEdge[] = [];
		const walk = (n: RadialTreeNode, a0: number, a1: number, depth: number, parent?: Placed) => {
			const angle = (a0 + a1) / 2;
			const p: Placed = {
				...n,
				depth,
				x: CX + depth * ring * Math.cos(angle),
				y: CY + depth * ring * Math.sin(angle),
			};
			placed.push(p);
			if (parent) edges.push({ x1: parent.x, y1: parent.y, x2: p.x, y2: p.y });
			const total = leafCount(n);
			let a = a0;
			for (const c of n.children ?? []) {
				const span = ((a1 - a0) * leafCount(c)) / total;
				walk(c, a, a + span, depth + 1, p);
				a += span;
			}
		};
		walk(local.root, 0, Math.PI * 2, 0);
		return { placed, edges };
	};

	const label = () => {
		const names = layout()
			.placed.map((p) => p.label)
			.join(", ");
		return local["aria-label"] ?? `Radial tree: ${names}`;
	};

	const boxW = (l: string, depth: number) => Math.max(depth === 0 ? 96 : 72, l.length * 6.5 + 24);
	const boxH = (depth: number) => (depth === 0 ? 40 : 30);

	return (
		<div class={`solidui-radial-tree ${sizeClass[local.size ?? "md"]} ${local.class ?? ""}`.trim()} {...rest}>
			<svg viewBox={`0 0 ${W} ${H}`} class="h-auto w-full" role="img" aria-label={label()}>
				<title>{label()}</title>
				<For each={layout().edges}>
					{(e) => <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} class="stroke-muted-foreground" stroke-width="1.5" />}
				</For>
				<For each={layout().placed}>
					{(n) => {
						const w = () => boxW(n.label, n.depth);
						const h = () => boxH(n.depth);
						const tone = () =>
							n.depth === 0
								? "fill-primary stroke-primary"
								: n.depth === 1
									? "fill-primary/10 stroke-primary/50"
									: "fill-surface stroke-border";
						const textTone = () => (n.depth === 0 ? "fill-primary-foreground" : "fill-foreground");
						return (
							<g>
								<rect
									x={n.x - w() / 2}
									y={n.y - h() / 2}
									width={w()}
									height={h()}
									rx={h() / 2}
									class={tone()}
									stroke-width="1.5"
								/>
								<text
									x={n.x}
									y={n.y}
									dy="0.35em"
									text-anchor="middle"
									class={textTone()}
									font-size={n.depth === 0 ? "12" : "11"}
									font-weight={n.depth === 0 ? "600" : "400"}
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
