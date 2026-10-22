/**
 * Semantic meter with value ranges
 */
import { type JSX, mergeProps, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type StatusVariant,
	statusVariants,
} from "../lib/variants";

const variantMap: Record<StatusVariant, string> = { ...statusVariants, default: "" };

export interface MeterProps
	extends Omit<JSX.MeterHTMLAttributes<HTMLMeterElement>, "value" | "min" | "max" | "low" | "high" | "optimum"> {
	variant?: StatusVariant;
	value?: number;
	min?: number;
	max?: number;
	low?: number;
	high?: number;
	optimum?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Meter(props: MeterProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "radius", "elevation"]);
	const merged = mergeProps({ value: 0, min: 0, max: 100, low: 0, high: 100, optimum: 100 }, rest);

	const className = () =>
		[
			"h-4 w-full",
			variantMap[local.variant ?? "default"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return <meter class={className()} {...merged} />;
}
