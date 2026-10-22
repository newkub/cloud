/**
 * Badge - small status or count pill.
 */

import { useComponentClasses } from "@wrikka/hooks";
import type { JSX } from "solid-js";
import { type ChipVariant, chipVariants, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const variantMap: Record<ChipVariant, string> = { ...chipVariants, default: "" };

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "px-2 py-0.5 text-2xs",
	md: "px-2.5 py-0.5 text-xs",
	lg: "px-3 py-1 text-sm",
};

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: ChipVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function Badge(props: BadgeProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
		unstyled: props.unstyled,
		variants: variantMap,
		sizes: sizeMap,
		defaultVariant: "default",
		defaultSize: "md",

		axes: [
			{ prop: "elevation", map: elevationMap },
			{ prop: "radius", map: radiusMap, default: "full" },
		],
	});
	return (
		<span class={className()} {...rest}>
			{props.children}
		</span>
	);
}
