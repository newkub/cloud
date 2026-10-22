/**
 * BadgeDelta — signed-delta badge with direction arrow and auto tone.
 * @deprecated Use `TrendBadge` — same chip with `format`, `invert` and `showIcon` options.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius } from "../lib/variants";
import { TrendBadge } from "./TrendBadge";

export interface BadgeDeltaProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Signed delta - sign picks the tone unless `tone` overrides */
	value: number;
	/** Value suffix @default "%" */
	suffix?: string;
	/** Override automatic tone */
	tone?: "success" | "destructive" | "muted";
	/** Badge size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const toneVariant = { success: "success", destructive: "destructive", muted: "default" } as const;

export function BadgeDelta(props: BadgeDeltaProps) {
	const [local, rest] = splitProps(props, ["value", "suffix", "tone", "size", "radius", "elevation"]);
	return (
		<TrendBadge
			value={local.value}
			format={(n) => `${n > 0 ? "+" : ""}${n}${local.suffix ?? "%"}`}
			variant={local.tone ? toneVariant[local.tone] : undefined}
			size={local.size}
			radius={local.radius}
			{...rest}
		/>
	);
}
