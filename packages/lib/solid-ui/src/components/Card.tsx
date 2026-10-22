/**
 * Card with header, content, and footer
 */
import { type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function Card(props: CardProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "children", "radius", "elevation", "unstyled"]);
	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					" border",
					variantMap[local.variant ?? "default"],
					radiusMap[local.radius ?? "xl"],
					local.elevation ? elevationMap[local.elevation] : "",
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");
	return (
		<div class={className()} {...rest}>
			{local.children}
		</div>
	);
}

export interface CardHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function CardHeader(props: CardHeaderProps) {
	const [local, rest] = splitProps(props, ["class", "size", "children", "radius", "elevation"]);
	const className = () =>
		[
			"flex flex-col space-y-1.5",
			paddingSizes[local.size ?? "lg"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<div class={className()} {...rest}>
			{local.children}
		</div>
	);
}

export interface CardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function CardContent(props: CardContentProps) {
	const [local, rest] = splitProps(props, ["class", "size", "children", "radius", "elevation"]);
	const className = () =>
		[
			paddingSizes[local.size ?? "lg"],
			"pt-0",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<div class={className()} {...rest}>
			{local.children}
		</div>
	);
}

export interface CardFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function CardFooter(props: CardFooterProps) {
	const [local, rest] = splitProps(props, ["class", "size", "children", "radius", "elevation"]);
	const className = () =>
		[
			"flex items-center",
			paddingSizes[local.size ?? "lg"],
			"pt-0",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<div class={className()} {...rest}>
			{local.children}
		</div>
	);
}
