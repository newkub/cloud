/**
 * InlineAlert — compact single-line status message with icon.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap, statusVariants } from "../lib/variants";

export interface InlineAlertProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: keyof typeof statusVariants;
	/** Compact density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Show status icon @default true */
	icon?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "px-2 py-1 text-xs", md: "px-3 py-2 text-sm", lg: "px-4 py-3 text-sm" } as const;
const icons: Record<string, string> = {
	default: "ℹ",
	primary: "ℹ",
	info: "ℹ",
	success: "✓",
	warning: "⚠",
	destructive: "✕",
};

export function InlineAlert(props: InlineAlertProps) {
	const [local, rest] = splitProps(props, ["class", "children", "variant", "size", "icon", "radius", "elevation"]);
	const variant = () => local.variant ?? "default";
	return (
		<div
			role="status"
			class={`solidui-inline-alert flex items-center gap-2 border ${statusVariants[variant()]} ${sizeClass[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{(local.icon ?? true) ? (
				<span aria-hidden="true" class="shrink-0 font-semibold">
					{icons[variant()]}
				</span>
			) : null}
			<span class="min-w-0">{local.children}</span>
		</div>
	);
}
