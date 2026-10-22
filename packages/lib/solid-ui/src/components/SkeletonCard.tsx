/**
 * SkeletonCard — card-shaped loading skeleton with media block and text lines.
 * @deprecated Use `Skeleton` with `shape="card"`.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { Skeleton } from "./Skeleton";

export interface SkeletonCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Show the media/image block @default true */
	media?: boolean;
	/** Number of text lines @default 3 */
	lines?: number;
	/** Card size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function SkeletonCard(props: SkeletonCardProps) {
	const [local, rest] = splitProps(props, ["media", "lines", "size", "radius", "elevation"]);
	return (
		<Skeleton
			shape="card"
			media={local.media}
			lines={local.lines}
			size={local.size}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		/>
	);
}
