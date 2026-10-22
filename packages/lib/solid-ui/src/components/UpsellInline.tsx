/**
 * UpsellInline - compact horizontal "frequently bought together" row with per-item add buttons and a total.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface UpsellItem {
	/** Item name. */
	name: string;
	/** Unit price. */
	price: number;
	/** Optional thumbnail URL. */
	image?: string;
}

export interface UpsellInlineProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onAdd"> {
	/** Row heading. @default "Frequently bought together" */
	title?: string;
	/** Items to upsell. */
	items?: UpsellItem[];
	/** CTA label — adds every item when clicked. Omit to hide the CTA. */
	cta?: string;
	/** Currency prefix used when formatting prices. @default "$" */
	currency?: string;
	/** Called for each added item — once for per-item buttons, once per item for the CTA. */
	onAdd?: (item: UpsellItem) => void;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function UpsellInline(props: UpsellInlineProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-upsell-inline flex items-center gap-3 overflow-x-auto border px-3 py-2",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["title", "items", "cta", "currency", "onAdd"]);

	const items = () => local.items ?? [];
	const fmt = (price: number) => `${local.currency ?? "$"}${price.toFixed(2)}`;
	const total = () => items().reduce((sum, item) => sum + item.price, 0);

	return (
		<div class={className()} {...rest}>
			<span class="shrink-0 text-sm font-semibold text-foreground">{local.title ?? "Frequently bought together"}</span>
			<ul class="flex min-w-0 flex-1 items-center gap-2" aria-label="Upsell items">
				<For each={items()}>
					{(item) => (
						<li class="flex shrink-0 items-center gap-2 rounded-md border border-border bg-muted/50 px-2 py-1">
							<Show when={item.image}>
								<img src={item.image} alt={item.name} class="h-6 w-6 rounded object-cover" loading="lazy" />
							</Show>
							<span class="max-w-32 truncate text-xs text-foreground">{item.name}</span>
							<span class="text-xs font-medium tabular-nums text-muted-foreground">{fmt(item.price)}</span>
							<button
								type="button"
								aria-label={`Add ${item.name}`}
								class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs leading-none text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
								onClick={() => local.onAdd?.(item)}
							>
								+
							</button>
						</li>
					)}
				</For>
			</ul>
			<Show when={items().length > 0}>
				<span
					class="shrink-0 text-sm font-semibold tabular-nums text-foreground"
					role="status"
					aria-label="Total price"
				>
					{fmt(total())}
				</span>
			</Show>
			<Show when={local.cta}>
				<button
					type="button"
					class="h-7 shrink-0 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
					onClick={() => {
						for (const item of items()) local.onAdd?.(item);
					}}
				>
					{local.cta}
				</button>
			</Show>
		</div>
	);
}
