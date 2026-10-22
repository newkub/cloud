/**
 * ShowcaseCard - card with a 16:10 cover (image or icon), title, badge,
 * description and tags. Ported from create-docs runtime; prop-driven.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ShowcaseCardProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
	title: string;
	href: string;
	/** Cover image URL; falls back to `icon` tile. */
	image?: string;
	/** Icon node shown when there is no image. */
	icon?: JSX.Element;
	description?: string;
	tags?: string[];
	badge?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ShowcaseCard(props: ShowcaseCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"href",
		"image",
		"icon",
		"description",
		"tags",
		"badge",
		"radius",
		"elevation",
	]);
	return (
		<a
			href={local.href}
			class={`solidui-showcase-card group flex flex-col border border-border bg-surface/30 overflow-hidden no-underline hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "xl"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="h-40 bg-surface border-b border-border flex items-center justify-center overflow-hidden relative">
				<Show
					when={local.image}
					fallback={
						<span class="text-primary/60 group-hover:text-primary transition-colors" aria-hidden="true">
							{local.icon ?? (
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									class="h-12 w-12"
									aria-hidden="true"
								>
									<rect x="3" y="3" width="7" height="7" rx="1" />
									<rect x="14" y="3" width="7" height="7" rx="1" />
									<rect x="3" y="14" width="7" height="7" rx="1" />
									<rect x="14" y="14" width="7" height="7" rx="1" />
								</svg>
							)}
						</span>
					}
				>
					{(src) => (
						<img
							src={src()}
							alt={local.title}
							class="w-full h-full object-cover motion-safe:group-hover:scale-105 transition-transform"
							loading="lazy"
						/>
					)}
				</Show>
			</div>
			<div class="p-5 flex flex-col flex-1">
				<div class="flex items-center gap-2 mb-2">
					<h2 class="font-semibold text-foreground m-0 flex-1 min-w-0 truncate text-base">{local.title}</h2>
					<Show when={local.badge}>
						<span class="text-2xs px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">{local.badge}</span>
					</Show>
				</div>
				<Show when={local.description}>
					<p class="text-sm text-muted-foreground m-0 mb-3 flex-1 leading-relaxed line-clamp-3">{local.description}</p>
				</Show>
				<Show when={(local.tags ?? []).length > 0}>
					<div class="flex flex-wrap gap-1 mt-auto">
						<For each={(local.tags ?? []).slice(0, 4)}>
							{(tag) => (
								<span class="text-2xs px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">
									{tag}
								</span>
							)}
						</For>
					</div>
				</Show>
			</div>
		</a>
	);
}
