/**
 * SourceCard - compact citation card for AI search answers (domain + title + snippet).
 */
import { type JSX, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface SourceCardProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Source title. */
	title: string;
	/** Domain or site name. */
	domain?: string;
	/** Short excerpt. */
	snippet?: string;
	/** Citation index, e.g. 1 → shows [1]. */
	index?: number;
	/** Corner radius. */
	radius?: Radius;
}

export function SourceCard(props: SourceCardProps) {
	const [local, rest] = splitProps(props, ["class", "title", "domain", "snippet", "index", "radius", "href"]);

	const className = () =>
		[
			"solidui-source-card flex items-start gap-2 border border-border bg-card p-2.5 hover:bg-accent/50 transition-colors",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<a class={className()} href={local.href} target="_blank" rel="noopener noreferrer" {...rest}>
			{local.index !== undefined ? (
				<span class="mt-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-sm bg-muted px-1 text-[10px] font-medium text-muted-foreground">
					{local.index}
				</span>
			) : null}
			<span class="min-w-0 flex-1">
				<span class="block truncate text-sm font-medium text-foreground">{local.title}</span>
				{local.domain ? (
					<span class="flex items-center gap-1 text-xs text-muted-foreground">
						<NamedIcon name="globe" class="h-3 w-3" />
						{local.domain}
					</span>
				) : null}
				{local.snippet ? (
					<span class="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{local.snippet}</span>
				) : null}
			</span>
			<NamedIcon name="external-link" class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
		</a>
	);
}
