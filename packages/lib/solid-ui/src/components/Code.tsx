/**
 * Inline code element
 */

import { useComponentClasses } from "@wrikka/hooks";
import type { JSX } from "solid-js";
import type { ChipVariant } from "../lib/variants";
import { type Radius, radiusMap } from "../lib/variants";

const variantMap: Record<ChipVariant, string> = {
	default: "bg-muted text-foreground",
	primary: "bg-primary/10 text-primary",
	secondary: "bg-secondary text-secondary-foreground",
	success: "bg-success/10 text-success",
	warning: "bg-warning/10 text-warning",
	destructive: "bg-destructive/10 text-destructive",
	outline: "border border-border bg-transparent text-foreground",
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "text-2xs",
	md: "text-xs",
	lg: "text-sm",
};

export interface CodeProps extends JSX.HTMLAttributes<HTMLElement> {
	variant?: ChipVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

export function Code(props: CodeProps) {
	const { className, rest } = useComponentClasses(props, {
		base: " px-1.5 py-0.5 font-mono",
		variants: variantMap,
		sizes: sizeMap,
		defaultVariant: "default",
		defaultSize: "md",

		axes: [{ prop: "radius", map: radiusMap, default: "sm" }],
	});
	return (
		<code class={className()} {...rest}>
			{props.children}
		</code>
	);
}
