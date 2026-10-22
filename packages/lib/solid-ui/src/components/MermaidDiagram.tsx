/**
 * MermaidDiagram — renders a Mermaid-syntax subset (`graph`/`flowchart` and
 * `sequenceDiagram`) without the Mermaid dependency.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { parseMermaid } from "../lib/diagram-mermaid";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { FlowDiagram } from "./FlowDiagram";
import { SequenceDiagram } from "./SequenceDiagram";

export interface MermaidDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Mermaid source — `graph TD|LR` with `A-->B` edges, or `sequenceDiagram` */
	code: string;
	/** Diagram density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function MermaidDiagram(props: MermaidDiagramProps) {
	const [local, rest] = splitProps(props, ["class", "code", "size", "radius", "elevation"]);
	const parsed = () => parseMermaid(local.code ?? "");
	return (
		<div
			class={`solidui-mermaid ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show
				when={parsed()}
				fallback={
					<p class="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
						Unsupported diagram source — supports `graph`/`flowchart` and `sequenceDiagram`.
					</p>
				}
			>
				{(d) => {
					const p = d();
					return p.kind === "flow" ? (
						<FlowDiagram nodes={p.nodes} edges={p.edges} direction={p.direction} size={local.size} />
					) : (
						<SequenceDiagram actors={p.actors} messages={p.messages} size={local.size} />
					);
				}}
			</Show>
		</div>
	);
}
