/**
 * Loading spinner
 */

import { useComponentClasses } from "@wrikka/hooks";
import type { JSX } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const variantMap = {
	default: "border-primary",
	primary: "border-primary",
	secondary: "border-secondary",
	muted: "border-muted-foreground",
} as const;

const sizeMap = {
	sm: "h-4 w-4",
	md: "h-6 w-6",
	lg: "h-8 w-8",
} as const;

export interface SpinnerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: keyof typeof variantMap;
	size?: keyof typeof sizeMap;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Spinner(props: SpinnerProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "motion-safe:animate-spin border-2 border-t-transparent",
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
		<div class={className()} role="status" aria-label="Loading" {...rest}>
			<span class="sr-only">Loading</span>
		</div>
	);
}
