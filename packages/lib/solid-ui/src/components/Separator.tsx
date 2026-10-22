/**
 * Separator — horizontal or vertical rule.
 * @deprecated Use `Divider` — it supports the same orientation/variant/size plus labels.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { Divider } from "./Divider";

export interface SeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Line style — "default" maps to "solid". @default "default" */
	variant?: "default" | "solid" | "dashed" | "dotted";
	/** Line thickness @default "sm" */
	size?: "sm" | "md" | "lg";
	/** Line direction @default "horizontal" */
	orientation?: "horizontal" | "vertical";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Separator(props: SeparatorProps) {
	const [local, rest] = splitProps(props, ["variant", "size", "orientation", "radius", "elevation"]);
	return (
		<Divider
			orientation={local.orientation}
			size={local.size}
			variant={local.variant === "default" ? "solid" : local.variant}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		/>
	);
}
