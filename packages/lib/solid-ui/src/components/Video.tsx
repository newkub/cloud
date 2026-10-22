/**
 * Video - styled video player surface.
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

export interface VideoProps extends JSX.VideoHTMLAttributes<HTMLVideoElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Video(props: VideoProps) {
	const merged = mergeProps({ controls: true, preload: "metadata" as const }, props);
	const [local, rest] = splitProps(merged, ["class", "variant", "size", "children"]);
	const className = () =>
		[
			"w-full bg-black",
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			radiusMap[merged.radius ?? "md"],
			merged.elevation ? elevationMap[merged.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<video class={className()} {...rest}>
			{local.children}
		</video>
	);
}
