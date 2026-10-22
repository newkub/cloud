/**
 * Scrollable container
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

export interface ScrollAreaProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	orientation?: "vertical" | "horizontal" | "both";
	scrollbars?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ScrollArea(props: ScrollAreaProps) {
	const merged = mergeProps({ orientation: "both" as const, scrollbars: true }, props);
	const [local, rest] = splitProps(merged, ["class", "variant", "size", "orientation", "scrollbars", "children"]);

	const overflow = () => {
		switch (local.orientation) {
			case "vertical":
				return "overflow-y-auto overflow-x-hidden";
			case "horizontal":
				return "overflow-x-auto overflow-y-hidden";
			default:
				return "overflow-auto";
		}
	};

	const hideScroll = () => (local.scrollbars ? "" : "scrollbar-none");
	const className = () =>
		[
			"relative h-full w-full border border-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
			overflow(),
			hideScroll(),
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			radiusMap[merged.radius ?? "md"],
			merged.elevation ? elevationMap[merged.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be focusable for keyboard scrolling
		<div class={className()} tabIndex={0} {...rest}>
			{local.children}
		</div>
	);
}
