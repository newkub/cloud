/**
 * Counter - numeric value display capped at a max.
 */
import { type JSX, mergeProps, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface CounterProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	value?: number;
	max?: number;
	variant?: SurfaceVariant | "muted" | "danger";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const variantClasses: Record<NonNullable<CounterProps["variant"]>, string> = {
	...surfaceVariants,
	primary: "bg-primary text-primary-foreground",
	muted: "bg-muted text-muted-foreground",
	danger: "bg-destructive text-destructive-foreground",
};

const sizeMap: Record<NonNullable<CounterProps["size"]>, string> = {
	xs: "h-4 min-w-4 px-1 text-[8px]",
	sm: "h-[1.125rem] min-w-[1.125rem] px-1 text-[10px]",
	md: "h-5 min-w-[1.25rem] px-1.5 text-[10px]",
	lg: "h-6 min-w-6 px-2 text-xs",
	xl: "h-7 min-w-7 px-2.5 text-sm",
};

export function Counter(props: CounterProps) {
	const merged = mergeProps({ max: 99 }, props);
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"value",
		"max",
		"variant",
		"size",
		"radius",
		"elevation",
	]);

	const display = () => {
		if (local.value === undefined) return local.children;
		return local.value > merged.max ? `${merged.max}+` : String(local.value);
	};

	const className = () =>
		[
			"inline-flex items-center justify-center font-medium",
			sizeMap[local.size ?? "md"],
			variantClasses[local.variant ?? "primary"],
			radiusMap[local.radius ?? "full"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<span class={className()} {...rest}>
			{display()}
		</span>
	);
}
