/**
 * ReleaseNoteCard - version card with release date, highlight list and a link to full notes.
 */

import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";
import { Badge } from "./Badge";

export interface ReleaseNoteCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Version string, e.g. "v2.4.0". */
	version: string;
	/** Release date label, e.g. "Jan 12, 2026". */
	date: string;
	/** Bullet list of notable changes. */
	highlights: string[];
	/** Link to the full release notes — renders a footer link when set. */
	url?: string;
	/** Footer link label. @default "View release notes" */
	linkLabel?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function ReleaseNoteCard(props: ReleaseNoteCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"version",
		"date",
		"highlights",
		"url",
		"linkLabel",
		"variant",
		"radius",
		"unstyled",
	]);

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-release-note-card border p-4",
					surfaceVariants[local.variant ?? "default"],
					radiusMap[local.radius ?? "xl"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex items-center justify-between gap-3">
				<Badge variant="primary">{local.version}</Badge>
				<time class="text-xs text-muted-foreground">{local.date}</time>
			</div>
			<Show when={(local.highlights?.length ?? 0) > 0}>
				<ul class="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
					<For each={local.highlights}>{(h) => <li>{h}</li>}</For>
				</ul>
			</Show>
			<Show when={local.url}>
				<a
					href={local.url}
					class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					{local.linkLabel ?? "View release notes"}
					<span aria-hidden="true">→</span>
				</a>
			</Show>
		</div>
	);
}
