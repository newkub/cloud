/**
 * LinkGroup — footer-style grouped link columns with external-link support.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface LinkGroupLink {
	/** Link text. */
	label: string;
	/** Link target. */
	href: string;
	/** Opens in a new tab with `rel="noopener noreferrer"` and an indicator. */
	external?: boolean;
}

export interface LinkGroupGroup {
	/** Group heading. */
	title: string;
	/** Links in this group. */
	links: LinkGroupLink[];
}

export interface LinkGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Link groups rendered as columns. */
	groups: LinkGroupGroup[];
	/** Column count on `sm` screens and up. @default min(groups.length, 4) */
	columns?: 1 | 2 | 3 | 4 | 5 | 6;
}

const colMap = {
	1: "sm:grid-cols-1",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-3",
	4: "sm:grid-cols-4",
	5: "sm:grid-cols-5",
	6: "sm:grid-cols-6",
} as const;

export function LinkGroup(props: LinkGroupProps) {
	const [local, rest] = splitProps(props, ["class", "groups", "columns"]);
	const cols = () =>
		colMap[Math.min(Math.max(local.columns ?? local.groups?.length ?? 1, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6];
	return (
		<div class={`solidui-link-group grid grid-cols-1 gap-8 ${cols()} ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.groups}>
				{(group) => (
					<nav aria-label={group.title}>
						<p class="mb-3 text-sm font-semibold text-foreground">{group.title}</p>
						<ul class="space-y-2">
							<For each={group.links}>
								{(link) => (
									<li>
										<a
											href={link.href}
											class="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
											target={link.external ? "_blank" : undefined}
											rel={link.external ? "noopener noreferrer" : undefined}
										>
											{link.label}
											<Show when={link.external}>
												<svg
													class="h-3 w-3"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													aria-hidden="true"
												>
													<path d="M7 17 17 7M7 7h10v10" />
												</svg>
												<span class="sr-only">(opens in a new tab)</span>
											</Show>
										</a>
									</li>
								)}
							</For>
						</ul>
					</nav>
				)}
			</For>
		</div>
	);
}
