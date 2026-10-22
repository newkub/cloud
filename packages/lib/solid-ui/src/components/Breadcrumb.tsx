/**
 * Breadcrumb - navigation path with separators.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

export interface BreadcrumbProps extends JSX.HTMLAttributes<HTMLElement> {
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Breadcrumb(props: BreadcrumbProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "children", "radius", "elevation"]);
	const className = () =>
		[
			"text-sm text-muted-foreground",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<nav aria-label="breadcrumb" class={className()} {...rest}>
			<ol class="flex flex-wrap items-center gap-1.5">{local.children}</ol>
		</nav>
	);
}

export interface BreadcrumbItemProps extends JSX.HTMLAttributes<HTMLLIElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function BreadcrumbItem(props: BreadcrumbItemProps) {
	const [local, rest] = splitProps(props, ["class", "children", "radius", "elevation"]);
	const className = () =>
		[
			"flex items-center gap-1.5",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<li class={className()} {...rest}>
			{local.children}
		</li>
	);
}

export interface BreadcrumbLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	current?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function BreadcrumbLink(props: BreadcrumbLinkProps) {
	const [local, rest] = splitProps(props, ["class", "current", "children", "href", "radius", "elevation"]);
	const base =
		"rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
	const className = () =>
		[
			base,
			local.current ? "pointer-events-none font-medium text-foreground" : "text-muted-foreground",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show
			when={local.current}
			fallback={
				<a class={className()} href={local.href ?? "#"} {...rest}>
					{local.children}
				</a>
			}
		>
			<span class={className()} aria-current="page">
				{local.children}
			</span>
		</Show>
	);
}

export interface BreadcrumbSeparatorProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	children?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function BreadcrumbSeparator(props: BreadcrumbSeparatorProps) {
	const [local, rest] = splitProps(props, ["class", "children", "radius", "elevation"]);
	const className = () =>
		[
			"text-muted-foreground",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<span role="presentation" aria-hidden="true" class={className()} {...rest}>
			{local.children ?? (
				<svg
					class="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			)}
		</span>
	);
}

export interface BreadcrumbEllipsisProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
	const [local, rest] = splitProps(props, ["class", "radius", "elevation"]);
	const className = () =>
		[
			"flex h-5 w-5 items-center justify-center text-muted-foreground",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<span aria-hidden="true" class={className()} {...rest}>
			<span class="sr-only">More</span>…
		</span>
	);
}
