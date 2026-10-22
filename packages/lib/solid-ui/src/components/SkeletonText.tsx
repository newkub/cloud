/**
 * SkeletonText — skeleton text placeholder lines.
 * @deprecated Use `Skeleton` with `shape="text"`.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { Skeleton } from "./Skeleton";

export interface SkeletonTextProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Line count @default 3 */
	lines?: number;
	/** Fill tone @default "default" */
	variant?: "default" | "primary" | "secondary" | "muted";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function SkeletonText(props: SkeletonTextProps) {
	const [local, rest] = splitProps(props, ["lines", "variant", "radius", "elevation"]);
	return (
		<Skeleton
			shape="text"
			lines={local.lines}
			variant={local.variant}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		/>
	);
}
