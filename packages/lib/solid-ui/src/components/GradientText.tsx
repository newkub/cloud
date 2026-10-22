/**
 * GradientText — text with a gradient fill; optionally animated.
 */
import { type JSX, splitProps } from "solid-js";
import { type TextSize, textSizes } from "../lib/variants";

export interface GradientTextProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Gradient stops — any CSS colors. @default primary→info */
	from?: string;
	via?: string;
	to?: string;
	/** Direction. @default "to right" */
	direction?: string;
	/** Shift the gradient slowly. */
	animated?: boolean;
	children?: JSX.Element;
}

export function GradientText(props: GradientTextProps) {
	const [local, rest] = splitProps(props, ["class", "from", "via", "to", "direction", "animated", "children", "size"]);
	const stops = () =>
		[local.from ?? "hsl(var(--primary, 221 83% 53%))", local.via, local.to ?? "hsl(var(--info, 199 89% 48%))"]
			.filter(Boolean)
			.join(", ");
	return (
		<span
			class={`solidui-gradient-text bg-clip-text text-transparent ${local.animated ? "motion-safe:animate-pulse" : ""} ${textSizes[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			style={{
				"background-image": `linear-gradient(${local.direction ?? "to right"}, ${stops()})`,
				...(local.animated ? { "background-size": "200% 100%" } : {}),
			}}
			{...rest}
		>
			{local.children}
		</span>
	);
}
