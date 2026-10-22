/**
 * LoadingCard — card skeleton with an avatar circle and staggered shimmer bars.
 * @deprecated Use `Skeleton` with `shape="card"`, `avatar` and `label`.
 */
import { type JSX, splitProps } from "solid-js";
import type { Radius } from "../lib/variants";
import { Skeleton } from "./Skeleton";

export interface LoadingCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Number of skeleton text lines. @default 3 */
	lines?: number;
	/** Show an avatar circle before the lines. @default false */
	avatar?: boolean;
	/** Accessible loading label. @default "Loading" */
	label?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function LoadingCard(props: LoadingCardProps) {
	const [local, rest] = splitProps(props, ["lines", "avatar", "label", "radius"]);
	return (
		<Skeleton
			shape="card"
			media={false}
			lines={local.lines}
			avatar={local.avatar}
			label={local.label}
			radius={local.radius}
			{...rest}
		/>
	);
}
