/**
 * PricingTable — tiered pricing cards with feature lists and a highlighted plan.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Button } from "./Button";

export interface PricingTier {
	/** Plan name */
	name: string;
	/** Price text, e.g. "$12" or "Free" */
	price: string;
	/** Billing period shown beside the price */
	period?: string;
	/** Short tagline under the price */
	description?: string;
	/** Feature bullets */
	features: string[];
	/** Emphasize as the recommended plan @default false */
	highlighted?: boolean;
	/** CTA label @default "Get started" */
	ctaLabel?: string;
	/** CTA link — renders <a> instead of <button> */
	ctaHref?: string;
	/** Small ribbon above the card, e.g. "Most popular" */
	ribbon?: string;
}

export interface PricingTableProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Tiers rendered left-to-right */
	tiers: PricingTier[];
	/** Called with the chosen tier when its CTA is a button */
	onSelect?: (tier: PricingTier) => void;
	/** Compact card density @default false */
	compact?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const Check = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="h-4 w-4 shrink-0 text-success"
		aria-hidden="true"
	>
		<path d="M20 6 9 17l-5-5" />
	</svg>
);

export function PricingTable(props: PricingTableProps) {
	const [local, rest] = splitProps(props, ["class", "tiers", "onSelect", "compact", "radius", "elevation"]);
	const cols = () => Math.min((local.tiers ?? []).length, 4);
	return (
		<div
			class={`solidui-pricing-table grid gap-4 sm:grid-cols-2 ${cols() >= 3 ? "lg:grid-cols-3" : ""} ${cols() === 4 ? "xl:grid-cols-4" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.tiers ?? []}>
				{(tier) => (
					<div
						class={`relative flex flex-col border ${local.compact ? "p-4" : "p-6"} ${tier.highlighted ? "border-primary bg-card shadow-lg ring-1 ring-primary" : "border-border bg-card"} ${radiusMap[local.radius ?? "xl"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
					>
						<Show when={tier.ribbon}>
							<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-2xs font-semibold text-primary-foreground">
								{tier.ribbon}
							</span>
						</Show>
						<h3 class="text-sm font-semibold text-foreground">{tier.name}</h3>
						<div class="mt-2 flex items-baseline gap-1">
							<span class="text-3xl font-bold text-foreground">{tier.price}</span>
							<Show when={tier.period}>
								<span class="text-sm text-muted-foreground">/{tier.period}</span>
							</Show>
						</div>
						<Show when={tier.description}>
							<p class="mt-1 text-xs text-muted-foreground">{tier.description}</p>
						</Show>
						<ul class="mt-4 flex flex-1 flex-col gap-2">
							<For each={tier.features}>
								{(f) => (
									<li class="flex items-start gap-2 text-sm text-muted-foreground">
										<Check />
										{f}
									</li>
								)}
							</For>
						</ul>
						<Show
							when={tier.ctaHref}
							fallback={
								<Button
									variant={tier.highlighted ? "primary" : "secondary"}
									class="mt-5 w-full"
									onClick={() => local.onSelect?.(tier)}
								>
									{tier.ctaLabel ?? "Get started"}
								</Button>
							}
						>
							<a
								href={tier.ctaHref}
								class={`mt-5 inline-flex h-9 w-full items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
									tier.highlighted
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
								}`}
							>
								{tier.ctaLabel ?? "Get started"}
							</a>
						</Show>
					</div>
				)}
			</For>
		</div>
	);
}
