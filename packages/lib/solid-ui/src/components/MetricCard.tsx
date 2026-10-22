/**
 * MetricCard — labelled metric card with value, delta and hint.
 * @deprecated Use `Stat` — it supports `delta`, `deltaSuffix`, `hint`, `icon`,
 * `spark`, `loading` and an `inline` chip layout.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius, SurfaceVariant } from "../lib/variants";
import { Stat } from "./Stat";

export interface MetricCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	label: string;
	value: string | number;
	delta?: number;
	deltaSuffix?: string;
	hint?: string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	radius?: Radius;
	elevation?: Elevation;
}

export function MetricCard(props: MetricCardProps) {
	const [local, rest] = splitProps(props, [
		"label",
		"value",
		"delta",
		"deltaSuffix",
		"hint",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<Stat
			label={local.label}
			value={local.value}
			delta={local.delta}
			deltaSuffix={local.deltaSuffix}
			hint={local.hint}
			variant={local.variant}
			size={local.size}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		/>
	);
}
