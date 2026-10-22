/**
 * StickyBar — container that sticks to the top of its scroll context.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface StickyBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Top offset in px while stuck @default 0 */
	offsetTop?: number;
	/** Surface treatment @default "blur" */
	variant?: "solid" | "blur" | "transparent";
	/** Show bottom border @default true */
	bordered?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function StickyBar(props: StickyBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"offsetTop",
		"variant",
		"bordered",
		"radius",
		"elevation",
	]);
	const bg = () =>
		local.variant === "transparent"
			? "bg-transparent"
			: local.variant === "solid"
				? "bg-surface"
				: "bg-surface/80 backdrop-blur";
	return (
		<div
			class={`solidui-sticky-bar sticky top-0 z-sticky ${bg()} ${(local.bordered ?? true) ? "border-b border-border" : ""} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			style={{ top: `${local.offsetTop ?? 0}px` }}
			{...rest}
		>
			{local.children}
		</div>
	);
}
