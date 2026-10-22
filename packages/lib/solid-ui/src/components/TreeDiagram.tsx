/**
 * TreeDiagram — generic rooted tree rendered top-down or left-right.
 */
import { type JSX, splitProps } from "solid-js";
import { type DiagramEdge, type DiagramNode, DiagramSvg, type DiagramTone } from "../lib/diagram";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface TreeNode {
	id: string;
	label: string;
	tone?: DiagramTone;
	children?: TreeNode[];
}

export interface TreeDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Root node — children render below (or right of) it */
	root?: TreeNode;
	/** Layout direction @default "tb" */
	direction?: "tb" | "lr";
	/** Diagram density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;

export function flattenTree(root?: TreeNode): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
	const nodes: DiagramNode[] = [];
	const edges: DiagramEdge[] = [];
	const walk = (n: TreeNode, parent?: string) => {
		nodes.push({ id: n.id, label: n.label, tone: n.tone, shape: "rounded" });
		if (parent) edges.push({ from: parent, to: n.id });
		for (const c of n.children ?? []) walk(c, n.id);
	};
	if (root) walk(root);
	return { nodes, edges };
}

export function TreeDiagram(props: TreeDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "root", "direction", "size", "radius", "elevation"]);
	const data = () => flattenTree(local.root);
	return (
		<div
			class={`solidui-tree-diagram ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<DiagramSvg nodes={data().nodes} edges={data().edges} direction={local.direction ?? "tb"} label="Tree diagram" />
		</div>
	);
}
