/**
 * AppShell - application frame with header, sidebar and footer slots.
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

export interface AppShellProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	header?: JSX.Element;
	footer?: JSX.Element;
	sidebar?: JSX.Element;
	sidebarPosition?: "left" | "right";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function AppShell(props: AppShellProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"header",
		"footer",
		"sidebar",
		"sidebarPosition",
		"radius",
		"elevation",
	]);

	const className = () =>
		[
			"flex h-screen w-full flex-col overflow-hidden",
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<Show when={local.header}>
				<header class="shrink-0 border-b border-border">{local.header}</header>
			</Show>
			<div class="flex min-h-0 flex-1 flex-col sm:flex-row">
				<Show when={local.sidebar && local.sidebarPosition !== "right"}>
					<aside class="w-full shrink-0 overflow-y-auto border-b border-border sm:w-56 sm:border-b-0 sm:border-r">
						{local.sidebar}
					</aside>
				</Show>
				<main class="min-w-0 flex-1 overflow-y-auto">{local.children}</main>
				<Show when={local.sidebar && local.sidebarPosition === "right"}>
					<aside class="w-full shrink-0 overflow-y-auto border-t border-border sm:w-56 sm:border-l sm:border-t-0">
						{local.sidebar}
					</aside>
				</Show>
			</div>
			<Show when={local.footer}>
				<footer class="shrink-0 border-t border-border">{local.footer}</footer>
			</Show>
		</div>
	);
}
