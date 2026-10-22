/**
 * DefinitionList — semantic dl/dt/dd list, row or stacked layout.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DefinitionItem {
	term: JSX.Element;
	description: JSX.Element;
}

export interface DefinitionListProps extends JSX.HTMLAttributes<HTMLDListElement> {
	items: DefinitionItem[];
	/** "row" puts term left / description right; "stacked" indents descriptions. @default "row" */
	layout?: "row" | "stacked";
	/** Show divider lines between items. @default true in row layout */
	divided?: boolean;
	size?: "sm" | "md" | "lg";
	/** Corner radius (when bordered). */
	radius?: Radius;
	/** Wrap in a bordered surface. */
	bordered?: boolean;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;
const pad = { sm: "px-3 py-2", md: "px-4 py-2.5", lg: "px-5 py-3" } as const;

export function DefinitionList(props: DefinitionListProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"layout",
		"divided",
		"size",
		"radius",
		"bordered",
		"elevation",
	]);
	const row = () => (local.layout ?? "row") === "row";
	const divided = () => local.divided ?? row();
	return (
		<dl
			class={`solidui-definition-list ${textSize[local.size ?? "md"]} ${
				local.bordered
					? `border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""}`
					: ""
			} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.items}>
				{(item, i) => (
					<div
						class={`${row() ? `flex items-baseline justify-between gap-4 ${pad[local.size ?? "md"]}` : "py-1.5"} ${
							divided() && i() > 0 ? "border-t border-border/60" : ""
						}`.trim()}
					>
						<dt class={`font-medium text-foreground ${row() ? "shrink-0" : ""}`}>{item.term}</dt>
						<dd class={`min-w-0 text-muted-foreground ${row() ? "text-right" : "mt-0.5 pl-4"}`}>{item.description}</dd>
					</div>
				)}
			</For>
		</dl>
	);
}
