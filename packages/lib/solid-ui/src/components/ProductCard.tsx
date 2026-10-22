/**
 * ProductCard — e-commerce product card: image, name, price, rating, add-to-cart.
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

export interface ProductCardProps extends JSX.HTMLAttributes<HTMLElement> {
	name: string;
	price: string | number;
	/** Original (struck) price for sales. */
	originalPrice?: string | number;
	image?: string;
	/** 0–5 rating. */
	rating?: number;
	reviewCount?: number;
	/** Badge text on the image, e.g. "Sale". */
	badge?: string;
	currency?: string;
	href?: string;
	onAdd?: () => void;
	/** Sold-out state — disables add. */
	outOfStock?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-2.5", md: "p-3.5", lg: "p-4" } as const;
const nameSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;
const priceSize = { sm: "text-sm", md: "text-base", lg: "text-lg" } as const;

export function ProductCard(props: ProductCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"name",
		"price",
		"originalPrice",
		"image",
		"rating",
		"reviewCount",
		"badge",
		"currency",
		"href",
		"onAdd",
		"outOfStock",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const fmt = (p: string | number) => (typeof p === "number" ? `${local.currency ?? "$"}${p.toFixed(2)}` : p);
	const nameEl = () =>
		local.href ? (
			<a
				href={local.href}
				class={`block truncate font-medium text-foreground hover:text-primary ${nameSize[local.size ?? "md"]}`}
			>
				{local.name}
			</a>
		) : (
			<span class={`block truncate font-medium text-foreground ${nameSize[local.size ?? "md"]}`}>{local.name}</span>
		);
	return (
		<article
			class={`solidui-product-card group overflow-hidden ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="relative overflow-hidden">
				<Show when={local.image} fallback={<div class="aspect-square w-full bg-muted" />}>
					<img
						src={local.image}
						alt={local.name}
						class={`aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 ${local.outOfStock ? "opacity-50 grayscale" : ""}`}
					/>
				</Show>
				<Show when={local.badge}>
					<span class="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-2xs font-semibold text-destructive-foreground">
						{local.badge}
					</span>
				</Show>
				<Show when={local.outOfStock}>
					<span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground/70">
						Out of stock
					</span>
				</Show>
			</div>
			<div class={pad[local.size ?? "md"]}>
				{nameEl()}
				<Show when={local.rating !== undefined}>
					<div class="mt-1 flex items-center gap-0.5" role="img" aria-label={`Rated ${local.rating} of 5`}>
						<For each={[1, 2, 3, 4, 5]}>
							{(i) => (
								<svg
									class={`h-3 w-3 ${i <= Math.round(local.rating ?? 0) ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
								</svg>
							)}
						</For>
						<Show when={local.reviewCount !== undefined}>
							<span class="ml-1 text-2xs text-muted-foreground">({local.reviewCount})</span>
						</Show>
					</div>
				</Show>
				<div class="mt-2 flex items-center justify-between">
					<div class="flex items-baseline gap-1.5">
						<span class={`font-bold tabular-nums text-foreground ${priceSize[local.size ?? "md"]}`}>
							{fmt(local.price)}
						</span>
						<Show when={local.originalPrice}>
							<span class="text-2xs text-muted-foreground line-through">{fmt(local.originalPrice ?? "")}</span>
						</Show>
					</div>
					<Show when={local.onAdd}>
						<button
							type="button"
							disabled={local.outOfStock}
							aria-label={`Add ${local.name} to cart`}
							class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40"
							onClick={() => local.onAdd?.()}
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
			</div>
		</article>
	);
}
