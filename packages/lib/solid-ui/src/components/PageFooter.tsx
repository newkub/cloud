/**
 * PageFooter — site footer template with link columns, socials and copyright.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterColumn {
	title: string;
	links: FooterLink[];
}

export interface PageFooterProps extends JSX.HTMLAttributes<HTMLElement> {
	columns?: FooterColumn[];
	/** Logo / brand slot. */
	brand?: JSX.Element;
	/** Tagline under the brand. */
	tagline?: string;
	copyright?: string;
	/** Social icon links. */
	social?: { label: string; href: string; icon: JSX.Element }[];
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "px-4 py-6", md: "px-6 py-8", lg: "px-8 py-12" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function PageFooter(props: PageFooterProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"columns",
		"brand",
		"tagline",
		"copyright",
		"social",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<footer
			class={`solidui-page-footer border-t border-border bg-surface ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "none"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex flex-wrap gap-8">
				<Show when={local.brand || local.tagline || local.social}>
					<div class="min-w-40 max-w-xs">
						{local.brand}
						<Show when={local.tagline}>
							<p class={`mt-2 text-muted-foreground ${textSize[local.size ?? "md"]}`}>{local.tagline}</p>
						</Show>
						<Show when={local.social?.length}>
							<div class="mt-3 flex gap-2">
								<For each={local.social}>
									{(s) => (
										<a
											href={s.href}
											aria-label={s.label}
											class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										>
											{s.icon}
										</a>
									)}
								</For>
							</div>
						</Show>
					</div>
				</Show>
				<For each={local.columns}>
					{(col) => (
						<nav class="min-w-28" aria-label={col.title}>
							<div class={`font-semibold text-foreground ${local.size === "lg" ? "text-sm" : "text-xs"}`}>
								{col.title}
							</div>
							<ul class={`mt-2 space-y-1.5 ${textSize[local.size ?? "md"]}`}>
								<For each={col.links}>
									{(l) => (
										<li>
											<a
												href={l.href}
												class="rounded-sm text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
											>
												{l.label}
											</a>
										</li>
									)}
								</For>
							</ul>
						</nav>
					)}
				</For>
			</div>
			<Show when={local.copyright}>
				<div class={`mt-6 border-t border-border pt-4 text-muted-foreground ${textSize[local.size ?? "md"]}`}>
					{local.copyright}
				</div>
			</Show>
		</footer>
	);
}
