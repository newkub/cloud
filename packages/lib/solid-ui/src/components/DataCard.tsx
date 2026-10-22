/**
 * DataCard — labelled metric card with icon, big value, delta, and loading skeleton.
 * @deprecated Use `Stat` — same features plus `trend`, `spark` and `inline` mode.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius, SurfaceVariant } from "../lib/variants";
import { Stat } from "./Stat";

export interface DataCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Metric label */
	label: string;
	/** Metric value */
	value: string | number;
	/** Leading icon */
	icon?: JSX.Element;
	/** Helper text under the value */
	hint?: string;
	/** Signed delta — auto success/destructive tone */
	delta?: number;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	radius?: Radius;
	elevation?: Elevation;
	/** Render a skeleton instead of the value */
	loading?: boolean;
}

export function DataCard(props: DataCardProps) {
	const [local, rest] = splitProps(props, [
		"label",
		"value",
		"icon",
		"hint",
		"delta",
		"variant",
		"size",
		"radius",
		"elevation",
		"loading",
	]);
	return (
		<Stat
			label={local.label}
			value={local.value}
			icon={local.icon}
			hint={local.hint}
			delta={local.delta}
			variant={local.variant}
			size={local.size}
			radius={local.radius}
			elevation={local.elevation}
			loading={local.loading}
			{...rest}
		/>
	);
}
