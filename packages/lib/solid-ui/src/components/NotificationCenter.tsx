/**
 * NotificationCenter - notification list with dismiss-all.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type StatusVariant,
	statusVariants,
} from "../lib/variants";

const variantMap: Record<StatusVariant, string> = {
	...statusVariants,
	default: "border-border bg-card",
};

export interface NotificationItem {
	id: string | number;
	title: string;
	description?: string;
	timestamp?: string;
	read?: boolean;
}

export interface NotificationCenterProps extends JSX.HTMLAttributes<HTMLElement> {
	variant?: StatusVariant;
	notifications?: NotificationItem[];
	title?: string;
	emptyText?: string;
	onDismiss?: (id: string | number) => void;
	onDismissAll?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function NotificationCenter(props: NotificationCenterProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"variant",
		"notifications",
		"title",
		"emptyText",
		"onDismiss",
		"onDismissAll",
		"radius",
		"elevation",
	]);

	const items = () => local.notifications ?? [];

	const className = () =>
		[
			"w-80 max-w-[calc(100vw-2rem)] border motion-safe:animate-[su-fade-in_var(--su-transition-normal)]",
			variantMap[local.variant ?? "default"],
			radiusMap[local.radius ?? "lg"],
			elevationMap[local.elevation ?? "lg"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<section class={className()} aria-label={local.title ?? "Notifications"} {...rest}>
			<div class="flex items-center justify-between border-b border-border px-3 py-2">
				<span class="text-sm font-semibold">{local.title ?? "Notifications"}</span>
				<Show when={items().length > 0 && local.onDismissAll}>
					<button
						type="button"
						class="-my-1.5 inline-flex min-h-9 items-center rounded px-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => local.onDismissAll?.()}
					>
						Clear all
					</button>
				</Show>
			</div>
			<Show
				when={items().length > 0}
				fallback={
					<div class="p-4 text-center text-sm text-muted-foreground">{local.emptyText ?? "No notifications"}</div>
				}
			>
				<ul class="max-h-80 divide-y divide-border overflow-y-auto">
					<For each={items()}>
						{(item) => (
							<li class={`flex items-start justify-between gap-2 px-3 py-2.5 ${item.read ? "opacity-60" : ""}`}>
								<div class="min-w-0 flex-1">
									<div class="truncate text-sm font-medium">{item.title}</div>
									<Show when={item.description}>
										<div class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</div>
									</Show>
									<Show when={item.timestamp}>
										<div class="mt-1 text-[10px] text-muted-foreground">{item.timestamp}</div>
									</Show>
								</div>
								<Show when={local.onDismiss}>
									<button
										type="button"
										class="-my-1.5 flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										aria-label={`Dismiss ${item.title}`}
										onClick={() => local.onDismiss?.(item.id)}
									>
										✕
									</button>
								</Show>
							</li>
						)}
					</For>
				</ul>
			</Show>
			{local.children}
		</section>
	);
}
