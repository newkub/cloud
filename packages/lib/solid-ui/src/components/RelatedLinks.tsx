/**
 * RelatedLinks - "related docs" card grid for page footers. Prop-driven
 * version of create-docs' RelatedDocs — the caller computes relevance.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface RelatedLink {
	title: string;
	href: string;
	description?: string;
}

export interface RelatedLinksProps extends JSX.HTMLAttributes<HTMLElement> {
	items: RelatedLink[];
	/** Section heading. @default "Related" */
	heading?: string;
	/** Grid columns at ≥sm. @default 2 */
	columns?: 1 | 2 | 3 | 4;
	/** Card corner radius. */
	radius?: Radius;
}

const cols = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" } as const;

export function RelatedLinks(props: RelatedLinksProps) {
	const [local, rest] = splitProps(props, ["class", "items", "heading", "columns", "radius"]);
	return (
		<Show when={(local.items?.length ?? 0) > 0}>
			<nav
				aria-label={local.heading ?? "Related"}
				class={`solidui-related-links border-t border-border pt-6 mt-10 ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 m-0">
					{local.heading ?? "Related"}
				</h3>
				<ul class={`grid gap-2 ${cols[local.columns ?? 2]}`}>
					<For each={local.items}>
						{(item) => (
							<li>
								<a
									href={item.href}
									class={`block p-3 border border-border bg-surface hover:border-primary/50 transition-colors no-underline text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "lg"]}`}
								>
									<span class="block font-medium">{item.title}</span>
									<Show when={item.description}>
										<span class="block text-xs text-muted-foreground truncate mt-0.5">{item.description}</span>
									</Show>
								</a>
							</li>
						)}
					</For>
				</ul>
			</nav>
		</Show>
	);
}
