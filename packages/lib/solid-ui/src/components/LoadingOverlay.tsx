/**
 * LoadingOverlay - dimmed overlay with spinner over content.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const variantMap = {
	default: "bg-background/80",
	primary: "bg-primary/10",
	secondary: "bg-secondary/10",
	muted: "bg-muted/60",
} as const;

const spinnerVariantMap = {
	default: "border-primary",
	primary: "border-primary",
	secondary: "border-secondary",
	muted: "border-muted-foreground",
} as const;

export interface LoadingOverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
	visible?: boolean;
	label?: string;
	spinnerClass?: string;
	variant?: keyof typeof variantMap;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function LoadingOverlay(props: LoadingOverlayProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"visible",
		"label",
		"spinnerClass",
		"variant",
		"radius",
		"elevation",
	]);

	const base = "fixed inset-0 z-fixed flex flex-col items-center justify-center gap-3 backdrop-blur-sm";
	const className = () =>
		[
			base,
			variantMap[local.variant ?? "default"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const spinnerClass = () =>
		[
			"h-8 w-8 motion-safe:animate-spin rounded-full border-2 border-t-transparent",
			spinnerVariantMap[local.variant ?? "default"],
			local.spinnerClass ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return local.visible ? (
		<div class={className()} role="status" aria-live="polite" {...rest}>
			{local.children ?? <div class={spinnerClass()} aria-hidden="true" />}
			{local.label && <p class="text-sm text-muted-foreground">{local.label}</p>}
		</div>
	) : null;
}
