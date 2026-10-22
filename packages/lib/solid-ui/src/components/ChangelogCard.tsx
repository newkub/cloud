/**
 * ChangelogCard — release card: version tag, date, grouped change bullets and a compare link.
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

export interface ChangelogChanges {
	/** New features. */
	added?: string[];
	/** Bug fixes. */
	fixed?: string[];
	/** Breaking changes. */
	breaking?: string[];
}

export interface ChangelogCardRelease {
	/** Version tag, e.g. "2.4.0" — rendered with a "v" prefix. */
	version: string;
	/** Release date text. */
	date?: string;
	/** Grouped change lists. */
	changes: ChangelogChanges;
}

export interface ChangelogCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Release to render. */
	release?: ChangelogCardRelease;
	/** Compare/diff URL, e.g. "https://github.com/a/b/compare/v2.3.0...v2.4.0". */
	compareHref?: string;
	/** Surface variant. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const groups: { key: keyof ChangelogChanges; label: string; cls: string; path: string }[] = [
	{ key: "added", label: "Added", cls: "text-success", path: "M12 5v14M5 12h14" },
	{
		key: "fixed",
		label: "Fixed",
		cls: "text-warning",
		path: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
	},
	{ key: "breaking", label: "Breaking", cls: "text-destructive", path: "M13 2 3 14h7l-1 8 10-12h-7l1-8Z" },
];

export function ChangelogCard(props: ChangelogCardProps) {
	const [local, rest] = splitProps(props, ["class", "release", "compareHref", "variant", "radius", "elevation"]);
	return (
		<div
			class={`solidui-changelog-card border p-4 ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center gap-2">
				<span class="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-2xs font-semibold text-foreground">
					v{local.release?.version}
				</span>
				<Show when={local.release?.date}>
					<span class="text-2xs text-muted-foreground">{local.release?.date}</span>
				</Show>
				<Show when={local.compareHref}>
					<a
						href={local.compareHref}
						class="ml-auto text-2xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						Compare
					</a>
				</Show>
			</div>
			<For each={groups}>
				{(g) => (
					<Show when={(local.release?.changes[g.key] ?? []).length > 0}>
						<div class="mt-3">
							<h4 class={`text-2xs font-semibold uppercase tracking-wide ${g.cls}`}>{g.label}</h4>
							<ul class="mt-1 flex flex-col gap-1">
								<For each={local.release?.changes[g.key]}>
									{(change) => (
										<li class="flex items-start gap-1.5 text-xs text-muted-foreground">
											<svg
												class={`mt-0.5 h-3 w-3 shrink-0 ${g.cls}`}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												aria-hidden="true"
											>
												<path d={g.path} />
											</svg>
											<span>{change}</span>
										</li>
									)}
								</For>
							</ul>
						</div>
					</Show>
				)}
			</For>
		</div>
	);
}
