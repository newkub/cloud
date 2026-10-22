/**
 * ThumbnailStrip — horizontal filmstrip of frames with an active ring and arrow scrolling.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

/** One filmstrip frame. */
export interface ThumbnailFrame {
	/** Image URL — a gradient placeholder is drawn when omitted. */
	src?: string;
	/** Frame caption used for the button label. */
	label?: string;
}

const sizeMap = { sm: "h-12 w-20", md: "h-16 w-28", lg: "h-20 w-36" } as const;

/** Deterministic placeholder gradients — no external images needed. */
const gradients = [
	"from-primary/40 via-muted to-info/30",
	"from-success/40 via-muted to-primary/30",
	"from-warning/40 via-muted to-destructive/30",
	"from-info/40 via-muted to-success/30",
] as const;

export interface ThumbnailStripProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	frames: ThumbnailFrame[];
	/** Active frame index. */
	current: number;
	/** Called when a frame is picked. */
	onSelect?: (index: number) => void;
	/** Frame size. @default "md" */
	size?: keyof typeof sizeMap;
	/** Show scroll arrows. @default true */
	arrows?: boolean;
}

const arrowBtn =
	"absolute top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ThumbnailStrip(props: ThumbnailStripProps) {
	const [local, rest] = splitProps(props, ["class", "frames", "current", "onSelect", "size", "arrows"]);
	let strip: HTMLDivElement | undefined;
	const scrollBy = (dir: 1 | -1) => strip?.scrollBy?.({ left: dir * (strip.clientWidth || 200), behavior: "smooth" });

	return (
		<div class={`solidui-thumbnail-strip group relative ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={local.arrows ?? true}>
				<button type="button" class={`${arrowBtn} left-1`} aria-label="Scroll back" onClick={() => scrollBy(-1)}>
					<svg
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
			</Show>
			<div ref={strip} class="flex gap-2 overflow-x-auto scroll-smooth p-1">
				<For each={local.frames}>
					{(frame, i) => (
						<button
							type="button"
							aria-label={frame.label ?? `Frame ${i() + 1}`}
							aria-current={i() === local.current ? "true" : undefined}
							class={`relative shrink-0 overflow-hidden rounded-md border transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${sizeMap[local.size ?? "md"]} ${
								i() === local.current
									? "border-primary opacity-100 ring-2 ring-primary"
									: "border-border opacity-70 hover:opacity-100"
							}`}
							onClick={() => local.onSelect?.(i())}
						>
							<Show
								when={frame.src}
								fallback={
									<span
										class={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[i() % gradients.length]}`}
										aria-hidden="true"
									>
										<span class="text-2xs font-medium text-foreground/70">{frame.label ?? i() + 1}</span>
									</span>
								}
							>
								{(src) => <img src={src()} alt="" class="h-full w-full object-cover" />}
							</Show>
						</button>
					)}
				</For>
			</div>
			<Show when={local.arrows ?? true}>
				<button type="button" class={`${arrowBtn} right-1`} aria-label="Scroll forward" onClick={() => scrollBy(1)}>
					<svg
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
			</Show>
		</div>
	);
}
