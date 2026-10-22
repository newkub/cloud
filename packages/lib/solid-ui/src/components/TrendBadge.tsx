/**
 * TrendBadge — delta chip with direction arrow and automatic success/destructive tone.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type ChipVariant, chipVariants, type Radius, radiusMap } from "../lib/variants";

export interface TrendBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Signed delta — sign picks the tone and arrow */
	value: number;
	/** Custom value formatter — receives the raw number */
	format?: (n: number) => string;
	/** Invert the tone so down is good and up is bad @default false */
	invert?: boolean;
	/** Show the direction arrow @default true */
	showIcon?: boolean;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Override the automatic tone */
	variant?: ChipVariant;
	/** Corner radius. */
	radius?: Radius;
}

const sizeClass = {
	sm: "px-1.5 py-0.5 text-xs",
	md: "px-2 py-0.5 text-xs",
	lg: "px-2.5 py-1 text-sm",
} as const;

export function TrendBadge(props: TrendBadgeProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"format",
		"invert",
		"showIcon",
		"size",
		"variant",
		"radius",
	]);
	const variant = () => {
		if (local.variant) return local.variant;
		if (local.value === 0) return "default" as const;
		const positive = local.value > 0;
		return (positive !== (local.invert ?? false) ? "success" : "destructive") as ChipVariant;
	};
	const direction = () => (local.value > 0 ? "up" : local.value < 0 ? "down" : "flat");
	const display = () => (local.format ? local.format(local.value) : `${local.value > 0 ? "+" : ""}${local.value}`);
	return (
		<span
			class={`solidui-trend-badge inline-flex items-center gap-0.5 border font-semibold tabular-nums ${chipVariants[variant()]} ${sizeClass[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.showIcon ?? true}>
				<span aria-hidden="true">{direction() === "up" ? "▲" : direction() === "down" ? "▼" : "▬"}</span>
			</Show>
			<span class="sr-only">{direction() === "up" ? "up" : direction() === "down" ? "down" : "unchanged"}</span>
			{display()}
		</span>
	);
}
