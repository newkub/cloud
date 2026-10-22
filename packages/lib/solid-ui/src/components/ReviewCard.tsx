/**
 * ReviewCard — product review: avatar, author, star rating, date, body and helpfulness votes.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, surfaceVariants } from "../lib/variants";

export interface Review {
	/** Reviewer display name. */
	author: string;
	/** Avatar image URL — falls back to initials. */
	avatar?: string;
	/** 0–5 star rating. */
	rating: number;
	/** Review timestamp — string shown as-is, number/Date formatted. */
	ts?: string | number | Date;
	/** Optional headline above the body. */
	title?: string;
	body: string;
	/** "Helpful" vote count. @default 0 */
	helpful?: number;
	/** "Not helpful" vote count. @default 0 */
	unhelpful?: number;
	/** Show a "Verified purchase" badge. @default false */
	verified?: boolean;
}

export interface ReviewCardProps extends JSX.HTMLAttributes<HTMLElement> {
	review?: Review;
	/** Called with `true` for helpful, `false` for not helpful. */
	onVote?: (helpful: boolean) => void;
	/** Corner radius. */
	radius?: Radius;
}

function fmtTs(ts: string | number | Date): string {
	if (typeof ts === "string") return ts;
	return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function ReviewCard(props: ReviewCardProps) {
	const [local, rest] = splitProps(props, ["class", "review", "onVote", "radius"]);
	const initials = () =>
		local.review?.author
			.split(/\s+/)
			.map((w) => w[0])
			.slice(0, 2)
			.join("")
			.toUpperCase();

	return (
		<article
			class={`solidui-review-card w-full max-w-md border p-4 ${surfaceVariants.default} ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<header class="flex items-center gap-3">
				<Show
					when={local.review?.avatar}
					fallback={
						<span
							aria-hidden="true"
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
						>
							{initials()}
						</span>
					}
				>
					<img
						src={local.review?.avatar}
						alt=""
						class="h-9 w-9 shrink-0 rounded-full border border-border object-cover"
					/>
				</Show>
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-1.5">
						<span class="truncate text-sm font-medium text-foreground">{local.review?.author}</span>
						<Show when={local.review?.verified}>
							<span class="shrink-0 rounded-full border border-success/30 bg-success/10 px-1.5 py-px text-2xs font-medium text-success">
								Verified
							</span>
						</Show>
					</div>
					<div class="mt-0.5 flex items-center gap-2">
						<span class="flex items-center gap-0.5" role="img" aria-label={`Rated ${local.review?.rating} of 5`}>
							<For each={[1, 2, 3, 4, 5]}>
								{(i) => (
									<svg
										class={`h-3 w-3 ${i <= Math.round(local.review?.rating ?? 0) ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
									>
										<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
									</svg>
								)}
							</For>
						</span>
						<Show when={local.review?.ts !== undefined}>
							<time class="text-2xs text-muted-foreground">{fmtTs(local.review?.ts as string | number | Date)}</time>
						</Show>
					</div>
				</div>
			</header>
			<Show when={local.review?.title}>
				<p class="mt-3 text-sm font-semibold text-foreground">{local.review?.title}</p>
			</Show>
			<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{local.review?.body}</p>
			<Show when={local.onVote}>
				<footer class="mt-3 flex items-center gap-2 border-t border-border pt-3">
					<span class="text-2xs text-muted-foreground">Was this helpful?</span>
					<button
						type="button"
						class="inline-flex h-7 items-center gap-1 rounded-full border border-border px-2.5 text-2xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						aria-label={`Mark review by ${local.review?.author} as helpful`}
						onClick={() => local.onVote?.(true)}
					>
						<svg
							class="h-3 w-3"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
						</svg>
						Yes<Show when={local.review?.helpful !== undefined}> ({local.review?.helpful})</Show>
					</button>
					<button
						type="button"
						class="inline-flex h-7 items-center gap-1 rounded-full border border-border px-2.5 text-2xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						aria-label={`Mark review by ${local.review?.author} as not helpful`}
						onClick={() => local.onVote?.(false)}
					>
						No<Show when={local.review?.unhelpful !== undefined}> ({local.review?.unhelpful})</Show>
					</button>
				</footer>
			</Show>
		</article>
	);
}
