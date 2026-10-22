/**
 * StateDiagram — states and transitions rendered as a layered graph.
 * Start/end states get distinct pill shapes automatically.
 */
import { type JSX, splitProps } from "solid-js";
import { type DiagramEdge, type DiagramNode, DiagramSvg } from "../lib/diagram";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface StateDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** State ids or labelled states */
	states?: (string | { id: string; label: string })[];
	/** Transitions: { from, to, label? } */
	transitions?: DiagramEdge[];
	/** Layout direction @default "lr" */
	direction?: "tb" | "lr";
	/** Diagram density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;

export function StateDiagram(props: StateDiagramProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"states",
		"transitions",
		"direction",
		"size",
		"radius",
		"elevation",
	]);
	const nodes = (): DiagramNode[] =>
		(local.states ?? []).map((s, i) => {
			const base = typeof s === "string" ? { id: s, label: s } : s;
			const isTerminal = i === 0 || i === (local.states ?? []).length - 1;
			return { ...base, shape: "pill", tone: isTerminal ? "primary" : "default" };
		});
	return (
		<div
			class={`solidui-state-diagram ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<DiagramSvg
				nodes={nodes()}
				edges={local.transitions ?? []}
				direction={local.direction ?? "lr"}
				label="State diagram"
			/>
		</div>
	);
}
