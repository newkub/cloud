/**
 * IconBadge — icon inside a tinted rounded badge.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap, statusVariants } from "../lib/variants";

export interface IconBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: keyof typeof statusVariants;
	/** Badge size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Badge shape @default "rounded" */
	shape?: "rounded" | "circle" | "square";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "h-6 w-6 text-xs", md: "h-8 w-8 text-sm", lg: "h-10 w-10 text-base" } as const;
const shapeClass = { rounded: "rounded-lg", circle: "rounded-full", square: "rounded-sm" } as const;

export function IconBadge(props: IconBadgeProps) {
	const [local, rest] = splitProps(props, ["class", "children", "variant", "size", "shape", "radius", "elevation"]);
	return (
		<span
			class={`solidui-icon-badge inline-flex items-center justify-center border ${statusVariants[local.variant ?? "default"]} ${sizeClass[local.size ?? "md"]} ${shapeClass[local.shape ?? "rounded"]} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</span>
	);
}
