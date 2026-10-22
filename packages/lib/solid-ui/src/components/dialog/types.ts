import type { JSX } from "solid-js";
import type { Elevation, Radius } from "../../lib/variants";

export interface DialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	description?: string;
	children?: JSX.Element;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	class?: string;
	/** Corner radius. @default "xl" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure and ARIA only. @default false */
	unstyled?: boolean;
}
