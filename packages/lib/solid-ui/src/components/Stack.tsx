/**
 * Vertical or horizontal stack layout
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

type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export interface StackProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	direction?: "vertical" | "horizontal";
	gap?: number | string;
	align?: StackAlign;
	justify?: StackJustify;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const alignMap: Record<StackAlign, string> = {
	start: "items-start",
	center: "items-center",
	end: "items-end",
	stretch: "items-stretch",
	baseline: "items-baseline",
};

const justifyMap: Record<StackJustify, string> = {
	start: "justify-start",
	center: "justify-center",
	end: "justify-end",
	between: "justify-between",
	around: "justify-around",
	evenly: "justify-evenly",
};

export function Stack(props: StackProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"direction",
		"gap",
		"align",
		"justify",
		"children",
		"radius",
		"elevation",
	]);

	const className = () =>
		[
			"flex",
			local.direction === "horizontal" ? "flex-row" : "flex-col",
			alignMap[local.align ?? "stretch"],
			justifyMap[local.justify ?? "start"],
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const style = () => ({
		gap: typeof local.gap === "number" ? `${local.gap}px` : (local.gap ?? undefined),
	});

	return (
		<div class={className()} style={style()} {...rest}>
			{local.children}
		</div>
	);
}
