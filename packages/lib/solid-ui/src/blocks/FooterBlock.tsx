import { For, type JSX } from "solid-js";
import { Divider } from "../components/Divider";

export interface FooterSection {
	title: string;
	links: { label: string; href: string }[];
}

export interface FooterBlockProps extends JSX.HTMLAttributes<HTMLElement> {
	brand: string;
	tagline?: string;
	sections: FooterSection[];
	copyright?: string;
}

/** Composed footer — brand blurb plus grouped link columns. */
export function FooterBlock(props: FooterBlockProps) {
	return (
		<footer class={props.class}>
			<Divider class="mb-8" />
			<div class="grid gap-8 px-4 pb-8 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<p class="text-base font-bold">{props.brand}</p>
					{props.tagline && <p class="mt-1 text-sm text-muted-foreground">{props.tagline}</p>}
				</div>
				<For each={props.sections}>
					{(s) => (
						<nav aria-label={s.title}>
							<p class="mb-2 text-sm font-semibold">{s.title}</p>
							<ul class="flex flex-col gap-1.5">
								<For each={s.links}>
									{(l) => (
										<li>
											<a
												href={l.href}
												class="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
			{props.copyright && <p class="px-4 pb-6 text-2xs text-muted-foreground">{props.copyright}</p>}
		</footer>
	);
}
