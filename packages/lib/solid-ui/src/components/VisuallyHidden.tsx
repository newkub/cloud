/**
 * Accessible visually hidden wrapper
 */
import { type JSX, splitProps } from "solid-js";
import { paddingSizes, type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface VisuallyHiddenProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	focusable?: boolean;
}

export function VisuallyHidden(props: VisuallyHiddenProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "focusable", "children"]);

	const base = () => {
		const classes = ["sr-only"];
		if (local.focusable) {
			classes.push("focus:not-sr-only focus:static focus:whitespace-normal");
		}
		return classes.join(" ");
	};

	const className = () =>
		[
			base(),
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<span class={className()} {...rest}>
			{local.children}
		</span>
	);
}
