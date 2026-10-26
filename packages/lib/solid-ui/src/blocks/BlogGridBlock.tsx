import { createMemo, createSignal, For, Show, type JSX } from "solid-js";
import { ArticleCard } from "../components/ArticleCard";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";

export interface BlogPost {
	title: string;
	excerpt?: string;
	cover?: string;
	author?: { name: string; avatar?: string };
	date?: string;
	readTime?: string;
	tags?: string[];
	href?: string;
	featured?: boolean;
}

export interface BlogGridBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	posts: BlogPost[];
	/** Filter chips shown above the grid. */
	categories?: string[];
	emptyTitle?: string;
	onPostSelect?: (post: BlogPost) => void;
}

/** A filterable article grid with an optional featured lead. */
export function BlogGridBlock(props: BlogGridBlockProps) {
	const [active, setActive] = createSignal("All");
	const categories = createMemo(() => ["All", ...(props.categories ?? [])]);

	const filtered = createMemo(() => {
		const category = active();
		if (category === "All") return props.posts;
		return props.posts.filter((post) => post.tags?.includes(category));
	});

	const lead = createMemo(() => (active() === "All" ? filtered().find((post) => post.featured) : undefined));
	const rest = createMemo(() => (lead() ? filtered().filter((post) => post !== lead()) : filtered()));

	return (
		<div class={`flex flex-col gap-6 ${props.class ?? ""}`}>
			<div class="flex flex-col gap-3">
				<Show when={props.title}>
					<h2 class="text-2xl font-semibold tracking-tight">{props.title}</h2>
				</Show>
				<Show when={props.description}>
					<p class="max-w-2xl text-sm text-muted-foreground">{props.description}</p>
				</Show>
				<div class="flex flex-wrap gap-2">
					<For each={categories()}>
						{(category) => (
							<button
								type="button"
								onClick={() => setActive(category)}
								class="rounded-full border border-border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
								classList={{
									"border-primary bg-primary/10 text-primary": active() === category,
									"text-muted-foreground": active() !== category,
								}}
								aria-pressed={active() === category}
							>
								{category}
							</button>
						)}
					</For>
				</div>
			</div>
			<Show
				when={filtered().length > 0}
				fallback={
					<EmptyState
						title={props.emptyTitle ?? "No posts in this category"}
						description="Try another topic or clear the filter."
						action={
							<Button variant="secondary" size="sm" onClick={() => setActive("All")}>
								Show all
							</Button>
						}
					/>
				}
			>
				<Show when={lead()}>
					{(post) => (
						<ArticleCard
							title={post().title}
							excerpt={post().excerpt}
							cover={post().cover}
							author={post().author}
							date={post().date}
							readTime={post().readTime}
							tags={post().tags}
							href={post().href}
							coverAspect="21/9"
							onClick={() => props.onPostSelect?.(post())}
						/>
					)}
				</Show>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<For each={rest()}>
						{(post) => (
							<ArticleCard
								title={post.title}
								excerpt={post.excerpt}
								cover={post.cover}
								author={post.author}
								date={post.date}
								readTime={post.readTime}
								tags={post.tags}
								href={post.href}
								onClick={() => props.onPostSelect?.(post)}
							/>
						)}
					</For>
				</div>
				<Show when={props.posts.length > 0}>
					<p class="text-xs text-muted-foreground">
						{filtered().length} of {props.posts.length} posts
					</p>
				</Show>
			</Show>
		</div>
	);
}
