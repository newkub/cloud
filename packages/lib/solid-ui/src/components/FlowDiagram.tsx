/**
 * FlowDiagram — node/edge flow chart with automatic layered layout.
 * Supports top→bottom and left→right directions, node shapes, tones, and edge labels.
 */
import { type JSX, splitProps } from "solid-js";
import { type DiagramEdge, type DiagramNode, DiagramSvg, type DiagramTone } from "../lib/diagram";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface FlowDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Nodes to place — auto-layered by depth */
	nodes: DiagramNode[];
	/** Directed edges between node ids */
	edges: DiagramEdge[];
	/** Layout direction @default "tb" */
	direction?: "tb" | "lr";
	/** Default tone applied to nodes without their own @default "default" */
	variant?: "default" | "primary" | "muted";
	/** Diagram density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;

export function FlowDiagram(props: FlowDiagramProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"nodes",
		"edges",
		"direction",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const tone = (): DiagramTone | undefined =>
		local.variant === "primary" ? "primary" : local.variant === "muted" ? "muted" : undefined;
	const nodes = () => (local.nodes ?? []).map((n) => ({ ...n, tone: n.tone ?? tone() }));
	return (
		<div
			class={`solidui-flow-diagram ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<DiagramSvg nodes={nodes()} edges={local.edges ?? []} direction={local.direction ?? "tb"} label="Flow diagram" />
		</div>
	);
}
