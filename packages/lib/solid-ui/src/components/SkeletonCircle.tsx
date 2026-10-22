/**
 * SkeletonCircle — circular skeleton placeholder.
 * @deprecated Use `Skeleton` with `shape="circle"` and `px`.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { Skeleton } from "./Skeleton";

export interface SkeletonCircleProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Diameter in px @default 48 */
	size?: number;
	/** Fill tone @default "default" */
	variant?: "default" | "primary" | "secondary" | "muted";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function SkeletonCircle(props: SkeletonCircleProps) {
	const [local, rest] = splitProps(props, ["size", "variant", "radius", "elevation"]);
	return (
		<Skeleton
			shape="circle"
			px={local.size}
			variant={local.variant}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		/>
	);
}
