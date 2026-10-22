/**
 * OrderSummary — cart/checkout totals block with line items and price rows.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Card, CardContent, CardHeader } from "./Card";

export interface OrderItem {
	/** Item name */
	name: string;
	/** Quantity @default 1 */
	quantity?: number;
	/** Line total (formatted, e.g. "$12.00") */
	price: string;
	/** Optional thumbnail URL */
	image?: string;
	/** Small variant text, e.g. "Size M" */
	note?: string;
}

export interface PriceRow {
	/** Row label, e.g. "Shipping" */
	label: string;
	/** Row value (formatted) */
	value: string;
	/** De-emphasized row (discounts, credits) @default false */
	muted?: boolean;
}

export interface OrderSummaryProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Heading @default "Order summary" */
	title?: string;
	/** Line items */
	items: OrderItem[];
	/** Extra rows between items and total (shipping, tax, discount) */
	rows?: PriceRow[];
	/** Final total — rendered bold */
	total: string;
	/** Total label @default "Total" */
	totalLabel?: string;
	/** Compact item rows @default false */
	compact?: boolean;
	/** Card visual variant @default "default" */
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function OrderSummary(props: OrderSummaryProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"items",
		"rows",
		"total",
		"totalLabel",
		"compact",
		"variant",
		"radius",
		"elevation",
	]);
	return (
		<Card
			variant={local.variant}
			class={`solidui-order-summary w-full max-w-sm ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<CardHeader size="sm">
				<h3 class="text-sm font-semibold text-foreground">{local.title ?? "Order summary"}</h3>
			</CardHeader>
			<CardContent size="sm">
				<ul class="flex flex-col gap-3">
					<For each={local.items}>
						{(item) => (
							<li class="flex items-center gap-3">
								<Show when={item.image}>
									<img src={item.image} alt="" class="h-10 w-10 rounded-md border border-border object-cover" />
								</Show>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium text-foreground">
										{item.name}
										<Show when={(item.quantity ?? 1) > 1}>
											<span class="text-muted-foreground"> ×{item.quantity}</span>
										</Show>
									</p>
									<Show when={item.note}>
										<p class="text-2xs text-muted-foreground">{item.note}</p>
									</Show>
								</div>
								<span class="text-sm text-foreground">{item.price}</span>
							</li>
						)}
					</For>
				</ul>
				<div class={`mt-4 flex flex-col gap-1.5 border-t border-border pt-3 ${local.compact ? "text-xs" : "text-sm"}`}>
					<For each={local.rows}>
						{(row) => (
							<div class={`flex justify-between ${row.muted ? "text-muted-foreground" : "text-foreground"}`}>
								<span>{row.label}</span>
								<span>{row.value}</span>
							</div>
						)}
					</For>
					<div class="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold text-foreground">
						<span>{local.totalLabel ?? "Total"}</span>
						<span>{local.total}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
