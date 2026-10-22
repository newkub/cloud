/**
 * Divider — horizontal/vertical rule with optional label, thickness and line style.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DividerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Optional label rendered along the line. */
	label?: JSX.Element;
	/** Line direction @default "horizontal" */
	orientation?: "horizontal" | "vertical";
	/** Line style @default "solid" */
	variant?: "solid" | "dashed" | "dotted";
	/** Label position @default "center" */
	labelPosition?: "start" | "center" | "end";
	/** Line thickness @default "sm" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const thickMap = {
	sm: { h: "border-t", v: "border-l" },
	md: { h: "border-t-2", v: "border-l-2" },
	lg: { h: "border-t-4", v: "border-l-4" },
} as const;

export function Divider(props: DividerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"label",
		"orientation",
		"variant",
		"labelPosition",
		"size",
		"radius",
		"elevation",
	]);
	const borderStyle = () => local.variant ?? "solid";
	const thick = () => thickMap[local.size ?? "sm"];
	if ((local.orientation ?? "horizontal") === "vertical") {
		return (
			// biome-ignore lint/a11y/useSemanticElements: vertical separator needs a div for self-stretch flex sizing
			<div
				role="separator"
				aria-orientation="vertical"
				class={`solidui-divider mx-2 self-stretch border-border ${thick().v} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
				style={{ "border-left-style": borderStyle() }}
				{...rest}
			/>
		);
	}
	const rule = <span class={`flex-1 border-border ${thick().h}`} style={{ "border-top-style": borderStyle() }} />;
	const justify = () =>
		local.labelPosition === "start"
			? "justify-start"
			: local.labelPosition === "end"
				? "justify-end"
				: "justify-center";
	const extras = () =>
		`${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""}`.trim();
	if (!local.label) {
		return (
			// biome-ignore lint/a11y/useSemanticElements: separator div keeps consistent styling with the labelled variant
			<div
				role="separator"
				class={`solidui-divider flex items-center ${extras()} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				{rule}
			</div>
		);
	}
	return (
		// biome-ignore lint/a11y/useSemanticElements: labelled separator needs a div wrapper (hr cannot contain a label)
		<div
			role="separator"
			class={`solidui-divider flex items-center gap-3 ${justify()} ${extras()} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.labelPosition !== "start" ? rule : null}
			<span class="shrink-0 text-xs text-muted-foreground">{local.label}</span>
			{rule}
		</div>
	);
}
