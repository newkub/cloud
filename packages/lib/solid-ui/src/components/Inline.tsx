/**
 * Inline — horizontal flex row with gap, alignment, and wrap control.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface InlineProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Gap between children @default "md" */
	gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	/** Cross-axis alignment @default "center" */
	align?: "start" | "center" | "end" | "baseline" | "stretch";
	/** Main-axis distribution @default "start" */
	justify?: "start" | "center" | "end" | "between" | "around";
	/** Allow wrapping @default true */
	wrap?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const gapClass = { none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-3", lg: "gap-4", xl: "gap-6" } as const;
const alignClass = {
	start: "items-start",
	center: "items-center",
	end: "items-end",
	baseline: "items-baseline",
	stretch: "items-stretch",
} as const;
const justifyClass = {
	start: "justify-start",
	center: "justify-center",
	end: "justify-end",
	between: "justify-between",
	around: "justify-around",
} as const;

export function Inline(props: InlineProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"gap",
		"align",
		"justify",
		"wrap",
		"radius",
		"elevation",
	]);
	return (
		<div
			class={`solidui-inline flex ${gapClass[local.gap ?? "md"]} ${alignClass[local.align ?? "center"]} ${justifyClass[local.justify ?? "start"]} ${(local.wrap ?? true) ? "flex-wrap" : "flex-nowrap"} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</div>
	);
}
