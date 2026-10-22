import type { JSX } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../../lib/variants";
import type { MenuAlign, MenuSide } from "./context";

export const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-md",
};

export const sideClass: Record<MenuSide, string> = {
	top: "bottom-full",
	bottom: "top-full",
	left: "right-full",
	right: "left-full",
};

export const alignClassVertical: Record<MenuAlign, string> = {
	start: "left-0",
	center: "left-1/2 -translate-x-1/2",
	end: "right-0",
};

export const alignClassHorizontal: Record<MenuAlign, string> = {
	start: "top-0",
	center: "top-1/2 -translate-y-1/2",
	end: "bottom-0",
};

export const sideOffsetStyle: Record<MenuSide, keyof JSX.CSSProperties> = {
	top: "margin-bottom",
	bottom: "margin-top",
	left: "margin-right",
	right: "margin-left",
};

export const itemVariantClass = {
	default: "text-foreground hover:bg-primary hover:text-primary-foreground",
	destructive: "text-destructive hover:bg-destructive/10 hover:text-destructive",
} as const;
