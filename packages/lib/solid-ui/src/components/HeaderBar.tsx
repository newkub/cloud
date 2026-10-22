/**
 * HeaderBar — sticky app header with logo, nav and action slots.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface HeaderNavItem {
	label: string;
	href: string;
	active?: boolean;
}

export interface HeaderBarProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Logo/brand slot. */
	logo?: JSX.Element;
	nav?: HeaderNavItem[];
	/** Right-side actions slot. */
	actions?: JSX.Element;
	/** Search slot between nav and actions. */
	search?: JSX.Element;
	/** Sticky to top. @default true */
	sticky?: boolean;
	/** backdrop-blur + translucent bg. @default true */
	blur?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius (only when not full-bleed). */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const h = { sm: "h-11", md: "h-14", lg: "h-16" } as const;
const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function HeaderBar(props: HeaderBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"logo",
		"nav",
		"actions",
		"search",
		"sticky",
		"blur",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<header
			class={`solidui-header-bar inset-x-0 top-0 z-40 border-b border-border ${(local.sticky ?? true) ? "sticky" : ""} ${
				(local.blur ?? true) ? "bg-surface/80 backdrop-blur" : surfaceVariants[local.variant ?? "default"]
			} ${local.elevation ? elevationMap[local.elevation] : ""} ${radiusMap[local.radius ?? "none"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`mx-auto flex max-w-6xl items-center gap-6 px-4 ${h[local.size ?? "md"]}`}>
				{local.logo}
				<Show when={local.nav?.length}>
					<nav aria-label="Primary" class="hidden items-center gap-1 md:flex">
						<For each={local.nav}>
							{(item) => (
								<a
									href={item.href}
									aria-current={item.active ? "page" : undefined}
									class={`rounded-md px-3 py-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${textSize[local.size ?? "md"]} ${
										item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
									}`}
								>
									{item.label}
								</a>
							)}
						</For>
					</nav>
				</Show>
				<Show when={local.search}>
					<div class="hidden min-w-0 flex-1 md:block">{local.search}</div>
				</Show>
				<Show when={local.actions}>
					<div class="ml-auto flex items-center gap-2">{local.actions}</div>
				</Show>
			</div>
		</header>
	);
}
