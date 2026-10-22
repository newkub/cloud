/**
 * Semantic table wrapper
 */
import { type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

const cellPadding: Record<NonNullable<TableProps["size"]>, string> = {
	sm: "[&_th]:px-3 [&_th]:py-1.5 [&_td]:px-3 [&_td]:py-1.5",
	md: "[&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-2",
	lg: "[&_th]:px-6 [&_th]:py-3 [&_td]:px-6 [&_td]:py-3",
};

export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Table(props: TableProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "children", "radius", "elevation"]);
	const className = () =>
		[
			"w-full caption-bottom text-sm",
			variantMap[local.variant ?? "default"],
			local.size ? cellPadding[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<div class="overflow-x-auto">
			<table class={className()} {...rest}>
				{local.children}
			</table>
		</div>
	);
}
