/**
 * Aspect ratio wrapper
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

export interface AspectRatioProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	ratio?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function AspectRatio(props: AspectRatioProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "ratio", "children", "radius", "elevation"]);
	const className = () =>
		[
			"relative w-full overflow-hidden ",
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} style={{ "aspect-ratio": local.ratio ?? 1 }} {...rest}>
			<div class="absolute inset-0">{local.children}</div>
		</div>
	);
}
