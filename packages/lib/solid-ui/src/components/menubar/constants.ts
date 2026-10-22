import { type SurfaceVariant, surfaceVariants } from "../../lib/variants";

export const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface",
};

export const triggerSizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "px-2 py-1 text-xs",
	md: "px-3 py-2 text-sm",
	lg: "px-4 py-2.5 text-base",
};

export const contentAlignClass = {
	start: "left-0",
	center: "left-1/2 -translate-x-1/2",
	end: "right-0",
} as const;

export const itemVariantClass = {
	default: "text-foreground hover:bg-primary hover:text-primary-foreground",
	destructive: "text-destructive hover:bg-destructive/10 hover:text-destructive",
} as const;

let menubarId = 0;

export function createMenubarId() {
	return `menubar-${++menubarId}`;
}
