/**
 * ButtonGroup - joined buttons sharing one border, horizontal or vertical.
 */
import { type JSX, splitProps } from "solid-js";
import { controlSizes, controlVariants, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ButtonGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
	variant?: keyof typeof controlVariants;
	size?: keyof typeof controlSizes;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

export function ButtonGroup(props: ButtonGroupProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"orientation",
		"variant",
		"size",
		"radius",
		"elevation",
		"fullWidth",
	]);

	const base = "inline-flex overflow-hidden ";
	const orientationClass = () => (local.orientation === "vertical" ? "flex-col" : "");
	const className = () =>
		[
			base,
			orientationClass(),
			local.variant ? controlVariants[local.variant] : "",
			local.size ? controlSizes[local.size] : "",
			radiusMap[local.radius ?? "md"],
			elevationMap[local.elevation ?? "sm"],
			local.fullWidth ? "w-full" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: generic button group, not a form fieldset
		<div class={className()} role="group" {...rest}>
			{local.children}
		</div>
	);
}
