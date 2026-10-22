/**
 * AuctionBidCard - live auction card: countdown, current bid, leading/outbid state and bid form.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface AuctionBidCardProps extends JSX.HTMLAttributes<HTMLElement> {
	title: string;
	/** Current highest bid in major units. */
	currentBid: number;
	/** Auction end time — Date, ISO string or epoch ms. */
	endsAt: Date | string | number;
	/** Minimum increment over the current bid. @default 1 */
	minIncrement?: number;
	/** ISO 4217 currency code @default "USD" */
	currency?: string;
	/** BCP 47 locale — defaults to the runtime locale. */
	locale?: string;
	/** `true` shows a "Leading" badge, `false` an "Outbid" badge, `undefined` hides it. */
	leading?: boolean;
	/** Called with the entered amount when a valid bid is placed. */
	onBid?: (amount: number) => void;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function AuctionBidCard(props: AuctionBidCardProps) {
	const [local, pass] = splitProps(props, [
		"title",
		"currentBid",
		"endsAt",
		"minIncrement",
		"currency",
		"locale",
		"leading",
		"onBid",
	]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-auction-bid-card p-4",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const fmt = (n: number) =>
		new Intl.NumberFormat(local.locale, { style: "currency", currency: local.currency ?? "USD" }).format(n);
	const minBid = () => local.currentBid + (local.minIncrement ?? 1);
	const endsAtMs = () => new Date(local.endsAt).getTime();
	const ended = () => Number.isNaN(endsAtMs()) || endsAtMs() - Date.now() <= 0;
	const countdown = () => {
		const ms = endsAtMs() - Date.now();
		if (Number.isNaN(ms) || ms <= 0) return "Ended";
		const mins = Math.floor(ms / 60000);
		const days = Math.floor(mins / 1440);
		const hours = Math.floor((mins % 1440) / 60);
		const m = mins % 60;
		if (days > 0) return `${days}d ${hours}h left`;
		if (hours > 0) return `${hours}h ${m}m left`;
		if (m > 0) return `${m}m left`;
		return "Less than a minute left";
	};

	let inputRef: HTMLInputElement | undefined;
	const placeBid = () => {
		const amount = Number(inputRef?.value);
		if (Number.isFinite(amount) && amount >= minBid()) local.onBid?.(amount);
	};

	return (
		<article class={className()} {...rest}>
			<div class="flex items-start justify-between gap-2">
				<h3 class="truncate text-sm font-semibold text-foreground">{local.title}</h3>
				<Show when={local.leading !== undefined}>
					<span
						class={`shrink-0 rounded-full border px-2 py-0.5 text-2xs font-semibold ${local.leading ? chipVariants.success : chipVariants.destructive}`}
					>
						{local.leading ? "Leading" : "Outbid"}
					</span>
				</Show>
			</div>
			<div class="mt-2 flex items-baseline justify-between">
				<div>
					<p class="text-2xs uppercase tracking-wide text-muted-foreground">Current bid</p>
					<p class="text-lg font-bold tabular-nums text-foreground">{fmt(local.currentBid)}</p>
				</div>
				<p
					class={`text-xs tabular-nums ${ended() ? "font-semibold text-destructive" : "text-muted-foreground"}`}
					aria-live="polite"
				>
					{countdown()}
				</p>
			</div>
			<div class="mt-3 flex items-center gap-2">
				<input
					ref={inputRef}
					type="number"
					aria-label="Your bid"
					min={minBid()}
					step={local.minIncrement ?? 1}
					value={minBid()}
					disabled={ended()}
					class="h-9 w-full min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm tabular-nums text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
				/>
				<button
					type="button"
					disabled={ended()}
					class="h-9 shrink-0 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
					onClick={placeBid}
				>
					Place bid
				</button>
			</div>
			<p class="mt-1.5 text-2xs text-muted-foreground">
				Minimum bid <span class="tabular-nums">{fmt(minBid())}</span>
			</p>
		</article>
	);
}
