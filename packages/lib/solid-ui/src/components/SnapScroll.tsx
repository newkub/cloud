/**
 * SnapScroll - scroll container with mandatory section snapping.
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

export interface SnapScrollProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
	/** Snap axis @default "y" */
	axis?: "x" | "y" | "both";
	/** Snap strictness @default "mandatory" */
	snap?: "mandatory" | "proximity";
}

export function SnapScroll(props: SnapScrollProps) {
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
		"axis",
		"snap",
	]);
	const alignCls = () => ({ left: "text-left", center: "text-center", right: "text-right" })[local.align ?? "left"];
	const sizeCls = () => ({ sm: "text-xs", md: "text-sm", lg: "text-base" })[local.size ?? "md"];
	return (
		<div
			class={`solidui-snap-scroll ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "none"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${alignCls()} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`text-foreground ${sizeCls()}`}>{local.children ?? local.content}</div>
			<Show when={local.caption}>
				<div class="mt-1 text-xs text-muted-foreground">{local.caption}</div>
			</Show>
		</div>
	);
}
