/**
 * BundleCard - product bundle card: item list, struck-through sum, savings badge and CTA slot.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface BundleItem {
	name: string;
	/** Item price in major units. */
	price: number;
}

export interface BundleCardProps extends JSX.HTMLAttributes<HTMLElement> {
	title: string;
	items: BundleItem[];
	/** Price charged for the whole bundle, in major units. */
	bundlePrice: number;
	image?: string;
	/** ISO 4217 currency code @default "USD" */
	currency?: string;
	/** BCP 47 locale — defaults to the runtime locale. */
	locale?: string;
	/** Default "Add bundle to cart" action — shown when no CTA children are given. */
	onAdd?: () => void;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
	/** CTA slot — replaces the default add button. */
	children?: JSX.Element;
}

export function BundleCard(props: BundleCardProps) {
	const [local, pass] = splitProps(props, [
		"title",
		"items",
		"bundlePrice",
		"image",
		"currency",
		"locale",
		"onAdd",
		"children",
	]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-bundle-card group overflow-hidden",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const fmt = (n: number) =>
		new Intl.NumberFormat(local.locale, { style: "currency", currency: local.currency ?? "USD" }).format(
			Number.isFinite(n) ? n : 0,
		);
	const sum = () => (local.items ?? []).reduce((acc, item) => acc + item.price, 0);
	const savings = () => sum() - local.bundlePrice;

	return (
		<article class={className()} {...rest}>
			<Show when={local.image}>
				<img src={local.image} alt={local.title} class="aspect-video w-full object-cover" />
			</Show>
			<div class="p-4">
				<div class="flex items-center justify-between gap-2">
					<h3 class="truncate text-sm font-semibold text-foreground">{local.title}</h3>
					<Show when={savings() > 0}>
						<span class={`shrink-0 rounded-full border px-2 py-0.5 text-2xs font-semibold ${chipVariants.success}`}>
							Save {fmt(savings())}
						</span>
					</Show>
				</div>
				<ul class="mt-2 space-y-1">
					<For each={local.items}>
						{(item) => (
							<li class="flex items-baseline justify-between gap-2 text-sm">
								<span class="truncate text-muted-foreground">{item.name}</span>
								<span class="tabular-nums text-foreground">{fmt(item.price)}</span>
							</li>
						)}
					</For>
				</ul>
				<div class="mt-3 flex items-center justify-between border-t border-border pt-3">
					<div class="flex items-baseline gap-2">
						<span class="text-lg font-bold tabular-nums text-foreground">{fmt(local.bundlePrice)}</span>
						<Show when={savings() > 0}>
							<s class="text-xs tabular-nums text-muted-foreground">{fmt(sum())}</s>
						</Show>
					</div>
					<Show
						when={local.children}
						fallback={
							<Show when={local.onAdd}>
								<button
									type="button"
									aria-label={`Add ${local.title} bundle to cart`}
									class="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									onClick={() => local.onAdd?.()}
								>
									Add bundle
								</button>
							</Show>
						}
					>
						{local.children}
					</Show>
				</div>
			</div>
		</article>
	);
}
