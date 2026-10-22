/**
 * InlineStat — compact label+value chip with optional delta, for text flows.
 * @deprecated Use `Stat` with `inline` — same chip layout.
 */
import { type JSX, splitProps } from "solid-js";
import type { ChipVariant, Radius } from "../lib/variants";
import { Stat } from "./Stat";

export interface InlineStatProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Metric label */
	label: string;
	/** Metric value */
	value: string | number;
	/** Signed delta — auto success/destructive tone */
	delta?: number;
	/** Delta suffix @default "%" */
	deltaSuffix?: string;
	/** Leading icon */
	icon?: JSX.Element;
	/** Chip tone @default "default" */
	variant?: ChipVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

export function InlineStat(props: InlineStatProps) {
	const [local, rest] = splitProps(props, [
		"label",
		"value",
		"delta",
		"deltaSuffix",
		"icon",
		"variant",
		"size",
		"radius",
	]);
	return (
		<Stat
			inline
			label={local.label}
			value={local.value}
			delta={local.delta}
			deltaSuffix={local.deltaSuffix}
			icon={local.icon}
			chipVariant={local.variant}
			size={local.size}
			radius={local.radius}
			{...rest}
		/>
	);
}
