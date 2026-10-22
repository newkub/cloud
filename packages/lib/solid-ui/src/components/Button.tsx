/**
 * Button - clickable action with variants, sizes and radius.
 */
import type { JSX } from "solid-js";
import { useButton } from "../hooks/useButton";
import type { Elevation, Radius } from "../lib/variants";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "primary" | "secondary" | "destructive" | "ghost" | "link";
	size?: "sm" | "md" | "lg" | "icon";
	/** Corner radius. @default "md" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** Strip all visual classes — keep behavior only. @default false */
	unstyled?: boolean;
}

export function Button(props: ButtonProps) {
	const { className, rest } = useButton(props);
	return (
		<button type="button" class={className()} {...rest}>
			{props.children}
		</button>
	);
}
