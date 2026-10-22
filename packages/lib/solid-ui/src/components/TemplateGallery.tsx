/**
 * TemplateGallery — grid of template tiles. Each tile draws a mini layout
 * preview with divs (accent bar tinted by `hue` plus skeleton lines), the
 * template name and a Use button.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface GalleryTemplate {
	id: string;
	name: string;
	/** Accent hue (0–360) for the mini preview bar. @default 215 */
	hue?: number;
	/** Optional description line under the name. */
	description?: string;
}

export interface TemplateGalleryProps extends JSX.HTMLAttributes<HTMLUListElement> {
	/** Templates to display. */
	templates?: GalleryTemplate[];
	/** Called with the template when its Use button is clicked. */
	onUse?: (template: GalleryTemplate) => void;
	/** Corner radius on tiles. */
	radius?: Radius;
}

export function TemplateGallery(props: TemplateGalleryProps) {
	const [local, rest] = splitProps(props, ["class", "templates", "onUse", "radius"]);

	return (
		<ul
			aria-label="Templates"
			style={{ "grid-template-columns": "repeat(auto-fill, minmax(9rem, 1fr))" }}
			class={`solidui-template-gallery m-0 grid list-none gap-3 p-0 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.templates ?? []}>
				{(t) => (
					<li class={`border border-border bg-surface p-2 ${radiusMap[local.radius ?? "lg"]}`}>
						<div
							class={`flex h-16 w-full flex-col gap-1 border border-border bg-background p-1.5 ${radiusMap[local.radius ?? "sm"]}`}
							aria-hidden="true"
						>
							<span class="h-1.5 w-1/2 rounded-full" style={{ background: `hsl(${t.hue ?? 215} 70% 55%)` }} />
							<span class="h-1 w-full rounded bg-muted" />
							<span class="h-1 w-3/4 rounded bg-muted" />
							<span class="mt-auto flex gap-1">
								<span class="h-1 w-1/3 rounded bg-muted" />
								<span class="h-1 w-1/3 rounded bg-muted" />
							</span>
						</div>
						<div class="mt-2 flex items-center justify-between gap-2">
							<span class="min-w-0">
								<span class="block truncate text-xs font-medium text-foreground">{t.name}</span>
								<Show when={t.description}>
									<span class="block truncate text-2xs text-muted-foreground">{t.description}</span>
								</Show>
							</span>
							<button
								type="button"
								aria-label={`Use ${t.name}`}
								onClick={() => local.onUse?.(t)}
								class="shrink-0 rounded bg-primary px-2 py-1 text-2xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								Use
							</button>
						</div>
					</li>
				)}
			</For>
		</ul>
	);
}
