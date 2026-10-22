/**
 * PlanCard — pricing plan card: name, billing-aware price, feature checklist, popular ribbon and CTA.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap, surfaceVariants } from "../lib/variants";

export interface PricingPlan {
	name: string;
	/** Monthly price — number or pre-formatted string. */
	price: number | string;
	/** Yearly price — shown when `billing="yearly"`. */
	yearly?: number | string;
	/** Feature checklist items. */
	features: string[];
	/** Highlight with a "Most popular" ribbon and primary CTA. @default false */
	popular?: boolean;
	/** Short blurb under the name. */
	description?: string;
	/** CTA label. @default "Choose plan" */
	cta?: string;
}

export interface PlanCardProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "onSelect"> {
	plan?: PricingPlan;
	/** Billing period — picks `plan.price` vs `plan.yearly`. @default "monthly" */
	billing?: "monthly" | "yearly";
	/** Currency symbol prepended to numeric prices. @default "$" */
	currency?: string;
	onSelect?: (plan: PricingPlan) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function PlanCard(props: PlanCardProps) {
	const [local, rest] = splitProps(props, ["class", "plan", "billing", "currency", "onSelect", "radius", "elevation"]);
	const fmt = (n: number | string) => (typeof n === "number" ? `${local.currency ?? "$"}${n}` : n);
	const yearly = () => (local.billing ?? "monthly") === "yearly" && local.plan?.yearly !== undefined;
	const price = () => (yearly() ? local.plan?.yearly : local.plan?.price);

	return (
		<article
			class={`solidui-plan-card relative flex w-full max-w-xs flex-col overflow-hidden border p-5 ${surfaceVariants.default} ${local.plan?.popular ? "border-primary/50 shadow-md" : ""} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.plan?.popular}>
				<span class="absolute right-0 top-0 rounded-bl-lg bg-primary px-2.5 py-1 text-2xs font-semibold text-primary-foreground">
					Most popular
				</span>
			</Show>
			<h3 class="text-base font-semibold text-foreground">{local.plan?.name}</h3>
			<Show when={local.plan?.description}>
				<p class="mt-0.5 text-xs text-muted-foreground">{local.plan?.description}</p>
			</Show>
			<div class="mt-3 flex items-baseline gap-1">
				<span class="text-3xl font-bold tabular-nums tracking-tight text-foreground">{fmt(price() ?? "")}</span>
				<span class="text-sm text-muted-foreground">/{yearly() ? "yr" : "mo"}</span>
			</div>
			<Show when={yearly()}>
				<p class="mt-0.5 text-2xs text-muted-foreground">Billed yearly</p>
			</Show>
			<ul class="mt-4 flex flex-1 flex-col gap-2">
				<For each={local.plan?.features}>
					{(feature) => (
						<li class="flex items-start gap-2 text-sm text-foreground">
							<svg
								class="mt-0.5 h-4 w-4 shrink-0 text-success"
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
							{feature}
						</li>
					)}
				</For>
			</ul>
			<button
				type="button"
				class={`mt-5 flex h-9 w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
					local.plan?.popular
						? "bg-primary text-primary-foreground hover:bg-primary/90"
						: "border border-border bg-transparent text-foreground hover:bg-muted"
				}`}
				onClick={() => local.plan && local.onSelect?.(local.plan)}
			>
				{local.plan?.cta ?? "Choose plan"}
			</button>
		</article>
	);
}
