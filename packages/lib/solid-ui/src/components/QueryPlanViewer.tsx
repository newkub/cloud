/**
 * QueryPlanViewer — indented query plan tree with cost/row badges and highlighted scan operators.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface PlanNode {
	/** Operator name, e.g. "Seq Scan" or "Nested Loop". */
	op: string;
	/** Estimated cost. */
	cost?: number;
	/** Estimated output rows. */
	rows?: number;
	/** Child operators. */
	children?: PlanNode[];
}

export interface QueryPlanViewerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Root plan node. */
	plan?: PlanNode;
	/** Op names matching this pattern are highlighted as scans @default /scan/i */
	scanPattern?: RegExp;
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

interface FlatNode {
	node: PlanNode;
	depth: number;
}

const flatten = (node: PlanNode | undefined): FlatNode[] => {
	const out: FlatNode[] = [];
	const walk = (n: PlanNode, depth: number) => {
		out.push({ node: n, depth });
		for (const child of n.children ?? []) walk(child, depth + 1);
	};
	if (node) walk(node, 0);
	return out;
};

const fmt = (n: number) => n.toLocaleString("en-US");
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function QueryPlanViewer(props: QueryPlanViewerProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-query-plan-viewer border py-2",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, dom] = splitProps(rest, ["plan", "scanPattern", "children"]);
	const nodes = () => flatten(local.plan);
	const isScan = (op: string) => (local.scanPattern ?? /scan/i).test(op);
	return (
		<div class={className()} role="tree" aria-label="Query plan" {...dom}>
			<Show
				when={nodes().length > 0}
				fallback={<div class="px-3 py-4 text-center text-xs text-muted-foreground">No plan</div>}
			>
				<For each={nodes()}>
					{({ node, depth }) => (
						// biome-ignore lint/a11y/useFocusableInteractive: read-only plan tree — rows are not individually focusable
						<div
							role="treeitem"
							aria-level={depth + 1}
							class={`flex items-center gap-2 px-3 py-1 font-mono ${textSize[props.size ?? "md"]} ${
								isScan(node.op) ? "bg-warning/10" : ""
							}`}
							style={{ "padding-left": `${0.75 + depth * 1}rem` }}
						>
							<span
								class={`min-w-0 flex-1 truncate ${isScan(node.op) ? "font-semibold text-warning" : "text-foreground"}`}
							>
								{node.op}
							</span>
							<Show when={node.cost !== undefined}>
								<span
									class={`inline-flex shrink-0 items-center rounded border px-1 py-0.5 text-2xs tabular-nums ${chipVariants.default}`}
								>
									cost {fmt(node.cost ?? 0)}
								</span>
							</Show>
							<Show when={node.rows !== undefined}>
								<span class="shrink-0 text-2xs tabular-nums text-muted-foreground">{fmt(node.rows ?? 0)} rows</span>
							</Show>
						</div>
					)}
				</For>
			</Show>
			{local.children}
		</div>
	);
}
