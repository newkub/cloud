/**
 * Text — typographic text with tone and size variants.
 */
import { type JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { type Radius, radiusMap } from "../lib/variants";

export interface TextProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Rendered element @default "p" */
	as?: "p" | "span" | "small" | "strong" | "em" | "label";
	/** Text tone @default "default" */
	variant?: "default" | "muted" | "primary" | "success" | "warning" | "destructive" | "info";
	/** Text size @default "md" */
	size?: "xs" | "sm" | "md" | "lg";
	/** Truncate with ellipsis @default false */
	truncate?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

const variantClass = {
	default: "text-foreground",
	muted: "text-muted-foreground",
	primary: "text-primary",
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	info: "text-info",
} as const;
const sizeClass = { xs: "text-2xs", sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function Text(props: TextProps) {
	const [local, rest] = splitProps(props, ["class", "children", "as", "variant", "size", "truncate", "radius"]);
	return (
		<Dynamic
			component={local.as ?? "p"}
			class={`solidui-text ${variantClass[local.variant ?? "default"]} ${sizeClass[local.size ?? "md"]} ${local.truncate ? "truncate" : ""} ${local.radius ? radiusMap[local.radius] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</Dynamic>
	);
}
