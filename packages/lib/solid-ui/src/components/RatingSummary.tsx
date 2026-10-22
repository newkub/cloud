/**
 * RatingSummary — average score + per-star breakdown bars.
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

export interface RatingBreakdown {
	/** Stars value (typically 5..1). */
	stars: number;
	count: number;
}

export interface RatingSummaryProps extends JSX.HTMLAttributes<HTMLDivElement> {
	ratings: RatingBreakdown[];
	/** Override the computed average. */
	average?: number;
	/** Star scale. @default 5 */
	maxStars?: number;
	/** Show the big average number + star row. @default true */
	showAverage?: boolean;
	/** Show total review count. @default true */
	showTotal?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const avgSize = { sm: "text-xl", md: "text-3xl", lg: "text-4xl" } as const;
const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;

export function RatingSummary(props: RatingSummaryProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"ratings",
		"average",
		"maxStars",
		"showAverage",
		"showTotal",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const ratings = () => local.ratings ?? [];
	const total = () => ratings().reduce((s, r) => s + r.count, 0);
	const avg = () => local.average ?? (total() ? ratings().reduce((s, r) => s + r.stars * r.count, 0) / total() : 0);
	const maxStars = () => local.maxStars ?? 5;
	const pct = (c: number) => (total() ? (c / total()) * 100 : 0);

	return (
		<div
			class={`solidui-rating-summary ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.showAverage ?? true}>
				<div class="mb-3 flex items-end gap-3">
					<span class={`font-bold tabular-nums leading-none text-foreground ${avgSize[local.size ?? "md"]}`}>
						{avg().toFixed(1)}
					</span>
					<div class="pb-0.5">
						<div class="flex text-warning" role="img" aria-label={`${avg().toFixed(1)} out of ${maxStars()} stars`}>
							<For each={Array.from({ length: maxStars() }, (_, i) => i)}>
								{(i) => (
									<svg
										class="h-3.5 w-3.5"
										viewBox="0 0 24 24"
										fill={i < Math.round(avg()) ? "currentColor" : "none"}
										stroke="currentColor"
										stroke-width="1.5"
										aria-hidden="true"
									>
										<path
											d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"
											stroke-linejoin="round"
										/>
									</svg>
								)}
							</For>
						</div>
						<Show when={local.showTotal ?? true}>
							<div class="mt-0.5 text-2xs text-muted-foreground">{total()} reviews</div>
						</Show>
					</div>
				</div>
			</Show>
			<div class="space-y-1.5">
				<For each={ratings()}>
					{(r) => (
						<div class="flex items-center gap-2 text-xs">
							<span class="w-6 shrink-0 tabular-nums text-muted-foreground">{r.stars}★</span>
							<div
								class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
								role="progressbar"
								aria-valuemin={0}
								aria-valuemax={Math.max(total(), 1)}
								aria-valuenow={r.count}
								aria-label={`${r.stars} star${r.stars === 1 ? "" : "s"}`}
							>
								<div
									class="h-full rounded-full bg-warning transition-[width] motion-reduce:transition-none"
									style={{ width: `${pct(r.count)}%` }}
								/>
							</div>
							<span class="w-10 shrink-0 text-right tabular-nums text-muted-foreground">{r.count}</span>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
