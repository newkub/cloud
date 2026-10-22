/**
 * List item
 */
import { type JSX, splitProps } from "solid-js";
import { paddingSizes, type Radius, radiusMap, surfaceVariants } from "../lib/variants";

export interface ListItemProps extends JSX.LiHTMLAttributes<HTMLLIElement> {
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
}

export function ListItem(props: ListItemProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "radius"]);
	const className = () =>
		[
			"text-sm text-foreground",
			local.variant ? surfaceVariants[local.variant] : "",
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return <li class={className()} {...rest} />;
}
