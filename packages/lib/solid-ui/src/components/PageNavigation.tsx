/**
 * PageNavigation — prev/next page cards for docs-style footers.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface PageLink {
	title: string;
	href: string;
	/** Small line above the title — defaults to "Previous"/"Next". */
	label?: string;
	description?: string;
}

export interface PageNavigationProps extends JSX.HTMLAttributes<HTMLElement> {
	prev?: PageLink;
	next?: PageLink;
	/** Extra content between/below the cards. */
	children?: JSX.Element;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const titleSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function PageNavigation(props: PageNavigationProps) {
	const [local, rest] = splitProps(props, ["class", "prev", "next", "children", "size", "radius", "elevation"]);

	const card = (link: PageLink | undefined, dir: "prev" | "next") => (
		<Show when={link} fallback={<span />}>
			{(l) => (
				<a
					href={l().href}
					class={`group flex flex-col gap-0.5 border border-border bg-surface transition-colors hover:border-primary/60 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${
						dir === "next" ? "items-end text-right" : ""
					}`}
				>
					<span class="flex items-center gap-1 text-2xs font-medium uppercase tracking-wide text-muted-foreground">
						{dir === "prev" && (
							<svg
								class="h-3 w-3 transition-transform motion-reduce:transition-none motion-safe:group-hover:-translate-x-0.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						)}
						{l().label ?? (dir === "prev" ? "Previous" : "Next")}
						{dir === "next" && (
							<svg
								class="h-3 w-3 transition-transform motion-reduce:transition-none motion-safe:group-hover:translate-x-0.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						)}
					</span>
					<span class={`font-medium text-foreground group-hover:text-primary ${titleSize[local.size ?? "md"]}`}>
						{l().title}
					</span>
					<Show when={l().description}>
						<span class="text-xs text-muted-foreground">{l().description}</span>
					</Show>
				</a>
			)}
		</Show>
	);

	return (
		<nav aria-label="Page navigation" class={`solidui-page-navigation ${local.class ?? ""}`.trim()} {...rest}>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{card(local.prev, "prev")}
				{card(local.next, "next")}
			</div>
			{local.children}
		</nav>
	);
}
