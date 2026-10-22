/**
 * Keyboard shortcut element
 */

import { useComponentClasses } from "@wrikka/hooks";
import type { JSX } from "solid-js";
import { type ChipVariant, chipVariants, type Radius, radiusMap } from "../lib/variants";

const variantMap: Record<ChipVariant, string> = {
	...chipVariants,
	default: "border-border bg-muted text-foreground",
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "px-1 py-0.5 text-2xs",
	md: "px-1.5 py-0.5 text-xs",
	lg: "px-2 py-1 text-sm",
};

export interface KbdProps extends JSX.HTMLAttributes<HTMLElement> {
	variant?: ChipVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

export function Kbd(props: KbdProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "inline-flex items-center justify-center border border-b-2 font-mono font-medium shadow-sm",
		variants: variantMap,
		sizes: sizeMap,
		defaultVariant: "default",
		defaultSize: "md",

		axes: [{ prop: "radius", map: radiusMap, default: "sm" }],
	});
	return (
		<kbd class={className()} {...rest}>
			{props.children}
		</kbd>
	);
}
