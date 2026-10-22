/**
 * Spacer - flexible space in flex layouts.
 */
import { type JSX, splitProps } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface SpacerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: number;
	axis?: "horizontal" | "vertical";
}

export function Spacer(props: SpacerProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "style", "size", "axis"]);

	const sizeStyle = () =>
		local.size !== undefined
			? local.axis === "horizontal"
				? { width: `${local.size * 0.25}rem`, height: "1px" }
				: { height: `${local.size * 0.25}rem`, width: "1px" }
			: {};

	const mergedStyle = () => ({ ...sizeStyle(), ...(local.style as JSX.CSSProperties | undefined) });
	const className = () =>
		["block", local.variant ? surfaceVariants[local.variant] : "", local.class ?? ""].filter(Boolean).join(" ");

	return <div class={className()} style={mergedStyle()} aria-hidden="true" {...rest} />;
}
