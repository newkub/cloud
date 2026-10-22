/**
 * NavigationRail — vertical icon rail for primary destinations (Material pattern).
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface NavigationRailItem {
	/** Destination id */
	id: string;
	/** Label under the icon */
	label: string;
	/** Optional icon (JSX or emoji/text) */
	icon?: JSX.Element;
	/** Optional link target */
	href?: string;
	/** Badge on the icon — number/text renders a count pill, `true` renders a dot */
	badge?: number | string | boolean;
}

export interface NavigationRailProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "onSelect"> {
	/** Destinations rendered top-to-bottom */
	items: NavigationRailItem[];
	/** Active destination id */
	active?: string;
	/** Called when a destination is selected */
	onSelect?: (id: string) => void;
	/** Expand to show labels beside icons instead of below @default false */
	expanded?: boolean;
	/** Show text labels — set false for a slim icon-only rail @default true */
	showLabels?: boolean;
	/** Rail accessible name @default "Primary" */
	"aria-label"?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function NavigationRail(props: NavigationRailProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"active",
		"onSelect",
		"expanded",
		"showLabels",
		"aria-label",
		"radius",
		"elevation",
	]);
	const isActive = (id: string) => local.active === id;
	const showLabels = () => local.showLabels ?? true;
	return (
		<nav
			class={`solidui-navigation-rail flex h-full flex-col items-center gap-1 border-r border-border bg-background py-3 ${local.expanded ? "w-56 items-stretch px-2" : showLabels() ? "w-16" : "w-14 py-2"} ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			aria-label={local["aria-label"] ?? "Primary"}
			{...rest}
		>
			<For each={local.items}>
				{(item) => {
					const body = showLabels() ? (
						<>
							<span class="relative flex h-8 w-8 items-center justify-center text-muted-foreground">
								{item.icon ?? item.label.charAt(0)}
								<Show when={item.badge !== undefined && item.badge !== false}>
									<span class="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-2xs font-bold text-destructive-foreground">
										{item.badge === true ? "" : item.badge}
									</span>
								</Show>
							</span>
							<span class={`text-2xs font-medium ${local.expanded ? "" : "text-center"}`.trim()}>{item.label}</span>
						</>
					) : (
						<>
							<span class="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
								{item.icon}
							</span>
							<Show when={item.badge !== undefined && item.badge !== false}>
								<Show
									when={item.badge === true}
									fallback={
										<span class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-2xs font-bold text-destructive-foreground">
											{item.badge}
										</span>
									}
								>
									<span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
								</Show>
							</Show>
							<Show when={isActive(item.id)}>
								<span
									class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
									aria-hidden="true"
								/>
							</Show>
						</>
					);
					const cls = showLabels()
						? `flex ${local.expanded ? "flex-row items-center gap-3 px-3 py-2" : "flex-col items-center gap-1 px-2 py-1.5"} rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive(item.id) ? "bg-primary/10 text-primary" : ""}`
						: `relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${isActive(item.id) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
					return item.href ? (
						<a
							href={item.href}
							class={cls}
							aria-current={isActive(item.id) ? "page" : undefined}
							aria-label={showLabels() ? undefined : item.label}
							title={showLabels() ? undefined : item.label}
						>
							{body}
						</a>
					) : (
						<button
							type="button"
							class={cls}
							aria-pressed={isActive(item.id)}
							aria-label={showLabels() ? undefined : item.label}
							title={showLabels() ? undefined : item.label}
							onClick={() => local.onSelect?.(item.id)}
						>
							{body}
						</button>
					);
				}}
			</For>
		</nav>
	);
}
