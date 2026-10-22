/**
 * ProductGrid — responsive product tiles with gradient placeholder, price, rating and quick-add.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, surfaceVariants } from "../lib/variants";

export interface GridProduct {
	id: string;
	name: string;
	/** Price — number formatted with `currency`, or pre-formatted string. */
	price: number | string;
	/** 0–5 rating shown as small stars. */
	rating?: number;
	/** Image URL — falls back to a gradient placeholder tile. */
	image?: string;
	/** Corner badge text, e.g. "New". */
	badge?: string;
	/** Sold-out state — dims the tile and disables quick-add. */
	outOfStock?: boolean;
}

export interface ProductGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	products: GridProduct[];
	/** Called with the product when quick-add is clicked. */
	onAdd?: (product: GridProduct) => void;
	/** Currency symbol prepended to numeric prices. @default "$" */
	currency?: string;
	/** Fixed column count — defaults to a responsive 2/3/4 grid. */
	columns?: 2 | 3 | 4;
	/** Tile corner radius. */
	radius?: Radius;
}

const colsMap = {
	2: "grid-cols-2",
	3: "grid-cols-2 sm:grid-cols-3",
	4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
} as const;

const gradients = [
	"from-primary/20 via-muted to-secondary/30",
	"from-info/20 via-muted to-primary/20",
	"from-warning/20 via-muted to-destructive/10",
	"from-success/20 via-muted to-info/20",
] as const;

export function ProductGrid(props: ProductGridProps) {
	const [local, rest] = splitProps(props, ["class", "products", "onAdd", "currency", "columns", "radius"]);
	const fmt = (p: number | string) => (typeof p === "number" ? `${local.currency ?? "$"}${p.toFixed(2)}` : p);

	return (
		<div class={`solidui-product-grid grid gap-3 ${colsMap[local.columns ?? 4]} ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.products}>
				{(product, i) => (
					<article
						class={`group relative flex flex-col overflow-hidden border ${surfaceVariants.default} ${radiusMap[local.radius ?? "lg"]} ${product.outOfStock ? "opacity-60" : ""}`}
					>
						<div class="relative aspect-square w-full overflow-hidden">
							<Show
								when={product.image}
								fallback={
									<div
										aria-hidden="true"
										class={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[i() % gradients.length]}`}
									>
										<span class="text-2xl font-bold text-muted-foreground/50">
											{product.name.charAt(0).toUpperCase()}
										</span>
									</div>
								}
							>
								<img
									src={product.image}
									alt={product.name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							</Show>
							<Show when={product.badge}>
								<span class="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-2xs font-semibold text-primary-foreground">
									{product.badge}
								</span>
							</Show>
							<Show when={local.onAdd && !product.outOfStock}>
								<button
									type="button"
									aria-label={`Quick add ${product.name} to cart`}
									class="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow transition-all hover:bg-primary/90 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring group-hover:opacity-100"
									onClick={() => local.onAdd?.(product)}
								>
									<svg
										class="h-3.5 w-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path d="M12 5v14M5 12h14" stroke-linecap="round" />
									</svg>
								</button>
							</Show>
						</div>
						<div class="flex flex-1 flex-col p-2.5">
							<span class="truncate text-sm font-medium text-foreground">{product.name}</span>
							<div class="mt-1 flex items-center justify-between gap-2">
								<span class="text-sm font-semibold tabular-nums text-foreground">{fmt(product.price)}</span>
								<Show when={product.rating !== undefined}>
									<span class="flex items-center gap-0.5" role="img" aria-label={`Rated ${product.rating} of 5`}>
										<For each={[1, 2, 3, 4, 5]}>
											{(s) => (
												<svg
													class={`h-2.5 w-2.5 ${s <= Math.round(product.rating ?? 0) ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
													viewBox="0 0 24 24"
													fill="currentColor"
													aria-hidden="true"
												>
													<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
												</svg>
											)}
										</For>
									</span>
								</Show>
							</div>
						</div>
					</article>
				)}
			</For>
		</div>
	);
}
