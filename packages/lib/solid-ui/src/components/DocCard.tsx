/**
 * DocCard — documentation row/card: doc icon, linked title, excerpt, updated-ago and tag chips.
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

export interface DocCardDoc {
	/** Doc title. */
	title: string;
	/** Short excerpt — clamped to two lines. */
	excerpt?: string;
	/** Updated-ago text, e.g. "3d ago". */
	updatedAt?: string;
	/** Tag chips. */
	tags?: string[];
}

export interface DocCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Doc to render. */
	doc?: DocCardDoc;
	/** Link wrapping the title. */
	href?: string;
	/** Surface variant. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function DocCard(props: DocCardProps) {
	const [local, rest] = splitProps(props, ["class", "doc", "href", "variant", "radius", "elevation"]);
	return (
		<div
			class={`solidui-doc-card flex items-start gap-3 border p-3 ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
					<path d="M14 2v6h6M9 13h6M9 17h4" />
				</svg>
			</span>
			<div class="min-w-0 flex-1">
				{local.href ? (
					<a
						href={local.href}
						class="block truncate text-sm font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						{local.doc?.title}
					</a>
				) : (
					<span class="block truncate text-sm font-medium text-foreground">{local.doc?.title}</span>
				)}
				<Show when={local.doc?.excerpt}>
					<p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{local.doc?.excerpt}</p>
				</Show>
				<div class="mt-1.5 flex flex-wrap items-center gap-1.5">
					<For each={local.doc?.tags ?? []}>
						{(tag) => (
							<span class="rounded-full border border-border bg-muted px-1.5 py-0.5 text-3xs text-muted-foreground">
								{tag}
							</span>
						)}
					</For>
					<Show when={local.doc?.updatedAt}>
						<span class="text-3xs text-muted-foreground">Updated {local.doc?.updatedAt}</span>
					</Show>
				</div>
			</div>
		</div>
	);
}
