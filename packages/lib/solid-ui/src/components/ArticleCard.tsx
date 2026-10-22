/**
 * ArticleCard — blog post card: cover, title, excerpt, byline, tags.
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

export interface ArticleCardProps extends JSX.HTMLAttributes<HTMLElement> {
	title: string;
	excerpt?: string;
	cover?: string;
	author?: { name: string; avatar?: string };
	/** Published text. */
	date?: string;
	readTime?: string;
	tags?: string[];
	href?: string;
	/** Cover aspect — "video" 16/9, "square" 1/1, or any CSS ratio. */
	coverAspect?: string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Horizontal layout — cover left. */
	horizontal?: boolean;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const titleSize = { sm: "text-sm", md: "text-base", lg: "text-lg" } as const;

export function ArticleCard(props: ArticleCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"excerpt",
		"cover",
		"author",
		"date",
		"readTime",
		"tags",
		"href",
		"coverAspect",
		"variant",
		"size",
		"radius",
		"elevation",
		"horizontal",
	]);
	const titleEl = () =>
		local.href ? (
			<a
				href={local.href}
				class={`font-semibold leading-snug text-foreground transition-colors hover:text-primary ${titleSize[local.size ?? "md"]}`}
			>
				{local.title}
			</a>
		) : (
			<span class={`font-semibold leading-snug text-foreground ${titleSize[local.size ?? "md"]}`}>{local.title}</span>
		);
	return (
		<article
			class={`solidui-article-card group overflow-hidden ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.horizontal ? "flex" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.cover}>
				<img
					src={local.cover}
					alt=""
					class={`object-cover transition-transform duration-300 group-hover:scale-105 ${local.horizontal ? "w-40" : "w-full"}`}
					style={{ "aspect-ratio": local.coverAspect ?? "16/9" }}
				/>
			</Show>
			<div class={pad[local.size ?? "md"]}>
				<Show when={local.tags?.length}>
					<div class="mb-1.5 flex flex-wrap gap-1">
						<For each={local.tags}>
							{(t) => (
								<span class="rounded-full bg-primary/10 px-1.5 py-0.5 text-2xs font-medium text-primary">{t}</span>
							)}
						</For>
					</div>
				</Show>
				{titleEl()}
				<Show when={local.excerpt}>
					<p class={`mt-1 line-clamp-2 text-muted-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>
						{local.excerpt}
					</p>
				</Show>
				<Show when={local.author || local.date || local.readTime}>
					<div class="mt-3 flex items-center gap-2 text-2xs text-muted-foreground">
						<Show when={local.author}>
							{(a) => (
								<>
									<span class="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-3xs font-semibold text-primary">
										{a().avatar ? (
											<img src={a().avatar} alt="" class="h-full w-full object-cover" />
										) : (
											a().name.charAt(0)
										)}
									</span>
									<span class="font-medium text-foreground/80">{a().name}</span>
								</>
							)}
						</Show>
						<Show when={local.date}>
							<span>· {local.date}</span>
						</Show>
						<Show when={local.readTime}>
							<span class="ml-auto">{local.readTime}</span>
						</Show>
					</div>
				</Show>
			</div>
		</article>
	);
}
