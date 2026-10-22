/**
 * Screenshot — image inside a browser-chrome or phone frame, with an optional caption.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap } from "../lib/variants";

/** Skeleton "page" drawn when no src is provided — keeps previews image-free. */
function PageSkeleton(props: { alt?: string }) {
	return (
		<div
			role="img"
			aria-label={props.alt ?? "Screenshot placeholder"}
			class="h-full w-full space-y-2 bg-gradient-to-b from-muted/60 to-background p-4"
		>
			<div class="h-3 w-1/3 rounded bg-muted-foreground/25" />
			<div class="h-8 w-full rounded bg-primary/15" />
			<div class="h-2 w-11/12 rounded bg-muted-foreground/15" />
			<div class="h-2 w-4/5 rounded bg-muted-foreground/15" />
			<div class="h-2 w-2/3 rounded bg-muted-foreground/15" />
		</div>
	);
}

export interface ScreenshotProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Image URL — a skeleton page is drawn when omitted. */
	src?: string;
	alt?: string;
	/** Address-bar text for the browser variant. @default "https://example.com" */
	url?: string;
	/** Frame style. @default "browser" */
	variant?: "browser" | "phone";
	/** Caption rendered as figcaption. */
	caption?: string;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Screenshot(props: ScreenshotProps) {
	const [local, rest] = splitProps(props, ["class", "src", "alt", "url", "variant", "caption", "elevation"]);

	const image = (cls: string) =>
		local.src ? <img src={local.src} alt={local.alt ?? ""} class={cls} /> : <PageSkeleton alt={local.alt} />;

	return (
		<figure class={`solidui-screenshot ${local.class ?? ""}`.trim()} {...rest}>
			<Show
				when={local.variant !== "phone"}
				fallback={
					<div
						class={`inline-block rounded-[2rem] border border-border bg-muted p-1.5 ${local.elevation ? elevationMap[local.elevation] : "shadow-lg"}`}
					>
						<div class="relative aspect-[9/19] w-40 overflow-hidden rounded-[1.6rem] bg-background">
							<div
								class="absolute left-1/2 top-1.5 z-10 h-3.5 w-14 -translate-x-1/2 rounded-full bg-foreground/90"
								aria-hidden="true"
							/>
							{image("h-full w-full object-cover object-top")}
						</div>
					</div>
				}
			>
				<div
					class={`overflow-hidden rounded-lg border border-border bg-surface ${local.elevation ? elevationMap[local.elevation] : "shadow-sm"}`}
				>
					<div class="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5">
						<span class="flex gap-1.5" aria-hidden="true">
							<span class="h-2 w-2 rounded-full bg-destructive/70" />
							<span class="h-2 w-2 rounded-full bg-warning/70" />
							<span class="h-2 w-2 rounded-full bg-success/70" />
						</span>
						<span class="flex h-5 min-w-0 flex-1 items-center rounded bg-background px-2 text-2xs text-muted-foreground">
							<span class="truncate">{local.url ?? "https://example.com"}</span>
						</span>
					</div>
					<div class="aspect-[16/10] bg-background">{image("h-full w-full object-cover object-top")}</div>
				</div>
			</Show>
			<Show when={local.caption}>
				<figcaption class="mt-2 text-center text-xs text-muted-foreground">{local.caption}</figcaption>
			</Show>
		</figure>
	);
}
