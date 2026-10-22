/**
 * DeliveryEstimate - carrier/method row with an icon, formatted ETA range and shipping cost.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

/** Single arrival date, or an earliest/latest window. */
export type DeliveryEta = { from: Date | string | number; to: Date | string | number } | Date | string | number;

export interface DeliveryEstimateProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Carrier name, e.g. "FedEx". */
	carrier?: string;
	/** Arrival window `{ from, to }` or a single delivery date. */
	eta: DeliveryEta;
	/** Shipping cost in major units — `0` renders as "Free". */
	price?: number;
	/** ISO 4217 currency code @default "USD" */
	currency?: string;
	/** Shipping method label, e.g. "Express". */
	method?: string;
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

export function DeliveryEstimate(props: DeliveryEstimateProps) {
	const [local, pass] = splitProps(props, ["carrier", "eta", "price", "currency", "method", "locale"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-delivery-estimate flex items-center gap-3 p-3",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const dayFmt = () => new Intl.DateTimeFormat(local.locale, { month: "short", day: "numeric" });
	const fmtDay = (d: Date) => (Number.isNaN(d.getTime()) ? undefined : dayFmt().format(d));
	const etaText = () => {
		const e = local.eta;
		if (typeof e === "object" && e !== null && !(e instanceof Date) && "from" in e) {
			const from = new Date(e.from);
			const to = new Date(e.to);
			const a = fmtDay(from);
			const b = fmtDay(to);
			if (!a || !b) return "date TBD";
			return from.toDateString() === to.toDateString() ? a : `${a} – ${b}`;
		}
		return fmtDay(new Date(e as Date | string | number)) ?? "date TBD";
	};
	const priceText = () => {
		if (local.price === undefined) return undefined;
		if (local.price === 0) return "Free";
		return new Intl.NumberFormat(local.locale, {
			style: "currency",
			currency: local.currency ?? "USD",
		}).format(local.price);
	};

	return (
		<div class={className()} {...rest}>
			<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
				<svg
					class="h-4.5 w-4.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
					<path d="M15 18h-5" />
					<path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-2" />
					<circle cx="7" cy="18" r="2" />
					<circle cx="17" cy="18" r="2" />
				</svg>
			</span>
			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-medium text-foreground">
					{[local.carrier, local.method].filter(Boolean).join(" · ") || "Delivery"}
				</p>
				<p class="text-xs text-muted-foreground">
					Arrives <time class="tabular-nums">{etaText()}</time>
				</p>
			</div>
			<Show when={priceText() !== undefined}>
				<span
					class={`text-sm tabular-nums ${local.price === 0 ? "font-medium text-success" : "font-semibold text-foreground"}`}
				>
					{priceText()}
				</span>
			</Show>
		</div>
	);
}
