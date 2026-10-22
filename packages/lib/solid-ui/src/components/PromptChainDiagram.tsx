/**
 * PromptChainDiagram - connected flow of prompt/tool/result nodes with arrow connectors.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type ChainNodeKind = "prompt" | "tool" | "result";

export interface ChainNode {
	/** Node label. */
	label: string;
	/** Node kind — controls icon and tone. */
	kind: ChainNodeKind;
}

const SAMPLE_NODES: ChainNode[] = [
	{ label: "System prompt", kind: "prompt" },
	{ label: "search_docs", kind: "tool" },
	{ label: "Draft answer", kind: "prompt" },
	{ label: "Final result", kind: "result" },
];

const kindStyle: Record<ChainNodeKind, string> = {
	prompt: "border-primary/30 bg-primary/10 text-primary",
	tool: "border-warning/30 bg-warning/10 text-warning",
	result: "border-success/30 bg-success/10 text-success",
};

const kindIcon: Record<ChainNodeKind, string> = {
	prompt: "sparkles",
	tool: "settings",
	result: "check",
};

const kindLabel: Record<ChainNodeKind, string> = {
	prompt: "Prompt",
	tool: "Tool",
	result: "Result",
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "p-3 text-2xs",
	md: "p-4 text-xs",
	lg: "p-6 text-sm",
};

export interface PromptChainDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Flow nodes in order; falls back to sample data. */
	nodes?: ChainNode[];
	/** Layout direction. @default "horizontal" */
	direction?: "horizontal" | "vertical";
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function PromptChainDiagram(props: PromptChainDiagramProps) {
	const [local, rest] = splitProps(props, ["nodes", "direction", "children"]);
	const { className, rest: dom } = useComponentClasses(rest, {
		base: "solidui-prompt-chain-diagram border",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		sizes: sizeMap,
		defaultVariant: "default",
		defaultSize: "md",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const nodes = () => local.nodes ?? SAMPLE_NODES;
	const vertical = () => local.direction === "vertical";

	return (
		<div class={className()} {...dom}>
			<ol
				class={`m-0 list-none p-0 ${vertical() ? "flex flex-col items-stretch gap-1" : "flex flex-wrap items-center gap-1"}`}
				aria-label="Prompt chain"
			>
				<For each={nodes()}>
					{(node, i) => (
						<>
							<Show when={i() > 0}>
								<li aria-hidden="true" class={vertical() ? "self-center" : ""}>
									<NamedIcon
										name="chevron-down"
										class={`h-4 w-4 shrink-0 text-muted-foreground ${vertical() ? "" : "-rotate-90"}`}
									/>
								</li>
							</Show>
							<li
								class={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-medium ${kindStyle[node.kind]}`}
								title={`${kindLabel[node.kind]}: ${node.label}`}
							>
								<NamedIcon name={kindIcon[node.kind]} class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
								<span class="truncate">{node.label}</span>
								<span class="sr-only">{` (${kindLabel[node.kind]})`}</span>
							</li>
						</>
					)}
				</For>
				<Show when={nodes().length === 0}>
					<li class="py-3 text-center text-muted-foreground">No nodes.</li>
				</Show>
			</ol>
		</div>
	);
}
