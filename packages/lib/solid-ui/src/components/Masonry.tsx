/**
 * Masonry - multi-column layout with variable-height cards.
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

export interface MasonryProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
	1: "columns-1",
	2: "columns-1 sm:columns-2",
	3: "columns-1 sm:columns-2 lg:columns-3",
	4: "columns-2 sm:columns-3 lg:columns-4",
};

const gapClasses: Record<number, string> = {
	2: "gap-2",
	3: "gap-3",
	4: "gap-4",
	6: "gap-6",
	8: "gap-8",
};

export function Masonry(props: MasonryProps) {
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
			columnClasses[merged.columns] ?? columnClasses[3],
			gapClasses[merged.gap] ?? "gap-4",
			"[&>*]:mb-4 [&>*]:break-inside-avoid",
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
