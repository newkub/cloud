/**
 * CSS grid layout container
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

export interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	columns?: number | string;
	rows?: number | string;
	gap?: number | string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

function template(value: number | string | undefined) {
	if (value === undefined) return undefined;
	if (typeof value === "number") return `repeat(${value}, minmax(0, 1fr))`;
	return value;
}

export function Grid(props: GridProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"columns",
		"rows",
		"gap",
		"children",
		"radius",
		"elevation",
	]);

	const className = () =>
		[
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const style = () => ({
		display: "grid",
		"grid-template-columns": template(local.columns),
		"grid-template-rows": template(local.rows),
		gap: typeof local.gap === "number" ? `${local.gap}px` : (local.gap ?? undefined),
	});

	return (
		<div class={className()} style={style()} {...rest}>
			{local.children}
		</div>
	);
}
