/**
 * LoyaltyTierCard - loyalty tier card: points balance, progress to the next tier and perk list.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	barVariants,
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface LoyaltyTierCardProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Current tier name, e.g. "Gold". */
	tier: string;
	/** Lifetime or cycle points balance. */
	points: number;
	/** Points needed to reach the next tier — omit for the top tier. */
	nextTierAt?: number;
	/** Perk descriptions listed with check marks. */
	perks?: string[];
	/** BCP 47 locale — defaults to the runtime locale. */
	locale?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function LoyaltyTierCard(props: LoyaltyTierCardProps) {
	const [local, pass] = splitProps(props, ["tier", "points", "nextTierAt", "perks", "locale"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-loyalty-tier-card p-4",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const pointsFmt = (n: number) => new Intl.NumberFormat(local.locale).format(n);
	const pct = () =>
		local.nextTierAt !== undefined && local.nextTierAt > 0
			? Math.min(100, Math.max(0, (local.points / local.nextTierAt) * 100))
			: 100;
	const remaining = () => Math.max(0, (local.nextTierAt ?? 0) - local.points);

	return (
		<article class={className()} {...rest}>
			<div class="flex items-center justify-between gap-2">
				<span
					class={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${chipVariants.primary}`}
				>
					{local.tier}
				</span>
				<p class="text-lg font-bold tabular-nums text-foreground">
					{pointsFmt(local.points)} <span class="text-xs font-normal text-muted-foreground">pts</span>
				</p>
			</div>
			<Show
				when={local.nextTierAt !== undefined}
				fallback={<p class="mt-3 text-xs font-medium text-success">Top tier reached</p>}
			>
				<div class="mt-3">
					<div
						class="h-2 w-full overflow-hidden rounded-full bg-muted"
						role="progressbar"
						aria-label="Progress to next tier"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(pct())}
					>
						<div class={`h-full rounded-full ${barVariants.default}`} style={{ width: `${pct()}%` }} />
					</div>
					<p class="mt-1.5 text-xs text-muted-foreground">
						<span class="tabular-nums">{pointsFmt(remaining())}</span> pts to next tier
					</p>
				</div>
			</Show>
			<Show when={(local.perks ?? []).length > 0}>
				<ul class="mt-3 space-y-1 border-t border-border pt-3">
					<For each={local.perks}>
						{(perk) => (
							<li class="flex items-start gap-2 text-sm text-foreground">
								<svg
									class="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M20 6 9 17l-5-5" />
								</svg>
								{perk}
							</li>
						)}
					</For>
				</ul>
			</Show>
		</article>
	);
}
