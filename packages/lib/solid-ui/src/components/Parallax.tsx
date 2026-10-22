/**
 * Parallax - children translate slower than the scroll speed.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface ParallaxProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Text content — `children` wins when both set */
	content?: JSX.Element;
	/** Muted secondary line */
	caption?: string;
	/** Text alignment @default "left" */
	align?: "left" | "center" | "right";
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Scroll speed multiplier @default 0.5 */
	speed?: number;
	/** Direction @default "y" */
	axis?: "x" | "y";
}

export function Parallax(props: ParallaxProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"content",
		"caption",
		"align",
		"variant",
		"size",
		"radius",
		"elevation",
		"children",
		"speed",
		"axis",
	]);
	const alignCls = () => ({ left: "text-left", center: "text-center", right: "text-right" })[local.align ?? "left"];
	const sizeCls = () => ({ sm: "text-xs", md: "text-sm", lg: "text-base" })[local.size ?? "md"];
	return (
		<div
			class={`solidui-parallax ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "none"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${alignCls()} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`text-foreground ${sizeCls()}`}>{local.children ?? local.content}</div>
			<Show when={local.caption}>
				<div class="mt-1 text-xs text-muted-foreground">{local.caption}</div>
			</Show>
		</div>
	);
}
