/**
 * AudioBookCard — cover art, title/author, progress ring and a resume button.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { controlSizes, controlVariants, type Radius, radiusMap } from "../lib/variants";

/** Audiobook metadata. */
export interface AudioBook {
	/** Cover image URL — a gradient monogram is drawn when omitted. */
	cover?: string;
	title: string;
	author: string;
	/** Fraction listened, 0–1. */
	progress: number;
}

const R = 42;
const CIRC = 2 * Math.PI * R;

export interface AudioBookCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	book?: AudioBook;
	/** Called when the resume button is pressed. */
	onResume?: (book: AudioBook) => void;
	/** Resume button label. @default "Resume" */
	resumeLabel?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function AudioBookCard(props: AudioBookCardProps) {
	const [local, rest] = splitProps(props, ["class", "book", "onResume", "resumeLabel", "radius"]);
	const pct = () => Math.round(Math.min(1, Math.max(0, local.book?.progress ?? 0)) * 100);
	const frac = () => Math.min(1, Math.max(0, local.book?.progress ?? 0));

	return (
		<div
			class={`solidui-audio-book-card flex items-center gap-4 border border-border bg-surface p-4 text-foreground shadow-sm ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`h-20 w-20 shrink-0 overflow-hidden ${radiusMap[local.radius ?? "md"]}`}>
				<Show
					when={local.book?.cover}
					fallback={
						<div
							role="img"
							aria-label={`Cover of ${local.book?.title}`}
							class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-info"
						>
							<span class="text-2xl font-bold text-primary-foreground">{local.book?.title.charAt(0)}</span>
						</div>
					}
				>
					{(src) => <img src={src()} alt={`Cover of ${local.book?.title}`} class="h-full w-full object-cover" />}
				</Show>
			</div>
			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-semibold">{local.book?.title}</p>
				<p class="truncate text-xs text-muted-foreground">{local.book?.author}</p>
				<button
					type="button"
					class={`${controlVariants.primary} ${controlSizes.sm} mt-2 rounded-md font-medium`}
					onClick={() => local.book && local.onResume?.(local.book)}
				>
					{local.resumeLabel ?? "Resume"}
				</button>
			</div>
			<div class="relative h-12 w-12 shrink-0">
				<svg viewBox="0 0 100 100" class="h-full w-full -rotate-90" role="img" aria-label={`${pct()}% listened`}>
					<circle cx="50" cy="50" r={R} fill="none" stroke-width="10" class="stroke-muted" />
					<circle
						cx="50"
						cy="50"
						r={R}
						fill="none"
						stroke-width="10"
						stroke-linecap="round"
						stroke-dasharray={`${CIRC}`}
						stroke-dashoffset={`${CIRC * (1 - frac())}`}
						class="stroke-primary"
					/>
				</svg>
				<span
					class="absolute inset-0 flex items-center justify-center text-2xs font-semibold tabular-nums"
					aria-hidden="true"
				>
					{pct()}%
				</span>
			</div>
		</div>
	);
}
