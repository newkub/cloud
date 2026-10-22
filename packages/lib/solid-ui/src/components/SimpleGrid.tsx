/**
 * SimpleGrid - responsive equal-column grid.
 */
import { type JSX, mergeProps, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface SimpleGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	columns?: 1 | 2 | 3 | 4;
	gap?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const columnClasses: Record<number, string> = {
	1: "grid-cols-1",
	2: "grid-cols-1 sm:grid-cols-2",
	3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
	4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

const gapClasses: Record<number, string> = {
	2: "gap-2",
	3: "gap-3",
	4: "gap-4",
	6: "gap-6",
	8: "gap-8",
};

export function SimpleGrid(props: SimpleGridProps) {
	const merged = mergeProps({ columns: 3 as const, gap: 4 }, props);
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"columns",
		"gap",
		"radius",
		"elevation",
	]);

	const className = () =>
		[
			"grid",
			columnClasses[merged.columns] ?? columnClasses[3],
			gapClasses[merged.gap] ?? "gap-4",
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			{local.children}
		</div>
	);
}
