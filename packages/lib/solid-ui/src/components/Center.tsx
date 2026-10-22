/**
 * Center - centers children horizontally and/or vertically.
 */
import { type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface CenterProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	inline?: boolean;
	axis?: "both" | "horizontal" | "vertical";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const axisClasses: Record<NonNullable<CenterProps["axis"]>, string> = {
	both: "items-center justify-center",
	horizontal: "justify-center",
	vertical: "items-center",
};

export function Center(props: CenterProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"inline",
		"axis",
		"radius",
		"elevation",
	]);
	const className = () =>
		[
			local.inline ? "inline-flex" : "flex",
			axisClasses[local.axis ?? "both"],
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
