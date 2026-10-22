/**
 * OrgChart — hierarchical organisation chart. Root renders with primary tone.
 */
import { type JSX, splitProps } from "solid-js";
import { DiagramSvg } from "../lib/diagram";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { flattenTree, type TreeNode } from "./TreeDiagram";

export interface OrgChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Root member — nested children become reports */
	root?: TreeNode;
	/** Diagram density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" } as const;

export function OrgChart(props: OrgChartProps) {
	const [local, rest] = splitProps(props, ["class", "root", "size", "radius", "elevation"]);
	const data = () => {
		const { nodes, edges } = flattenTree(local.root);
		return {
			nodes: nodes.map(
				(n) => ({ ...n, shape: "rounded" as const, tone: n.id === local.root?.id ? "primary" : "default" }) as typeof n,
			),
			edges,
		};
	};
	return (
		<div
			class={`solidui-org-chart ${sizeClass[local.size ?? "md"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<DiagramSvg nodes={data().nodes} edges={data().edges} direction="tb" label="Organisation chart" />
		</div>
	);
}
