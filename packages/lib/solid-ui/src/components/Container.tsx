/**
 * Container - centered content wrapper with max-width and fluid modes.
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

const maxWidthMap: Record<string, string> = {
	sm: "max-w-screen-sm",
	md: "max-w-screen-md",
	lg: "max-w-screen-lg",
	xl: "max-w-screen-xl",
	"2xl": "max-w-screen-2xl",
	full: "max-w-full",
};

export interface ContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	fluid?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Container(props: ContainerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"maxWidth",
		"fluid",
		"radius",
		"elevation",
	]);

	const base = "mx-auto w-full px-4 sm:px-6 lg:px-8";
	const maxWidthClass = () => (local.fluid ? "max-w-full" : maxWidthMap[local.maxWidth ?? "xl"]);
	const className = () =>
		[
			base,
			maxWidthClass(),
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
