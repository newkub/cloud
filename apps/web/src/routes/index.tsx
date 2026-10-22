import { createFileRoute } from "@tanstack/solid-router";
import { For } from "solid-js";
import { ProductCard } from "../components/ProductCard";
import { isAvailable, productGroups, products } from "../data/products";

export const Route = createFileRoute("/")({ component: ProductsPage });

function ProductsPage() {
	const liveCount = () => products.filter(isAvailable).length;
	return (
		<div class="mx-auto max-w-6xl px-6 py-8">
			<header class="mb-8">
				<h1 class="text-2xl font-semibold tracking-tight">Products</h1>
				<p class="mt-1 text-sm text-dim">
					Build and scale with Wrikka Cloud infrastructure.
				</p>
				<div class="mt-4 flex flex-wrap gap-2 text-xs text-dim">
					<span class="rounded-full border border-edge bg-panel px-2.5 py-1">
						{products.length} products
					</span>
					<span class="rounded-full border border-acc/30 bg-acc/10 px-2.5 py-1 text-acc">
						{liveCount()} live
					</span>
					<span class="rounded-full border border-edge bg-panel px-2.5 py-1">
						{productGroups.length} categories
					</span>
				</div>
			</header>

			<For each={productGroups}>
				{(group) => (
					<section class="mb-8">
						<h2 class="mb-3 text-xs font-medium uppercase tracking-wider text-faint">
							{group.label}
						</h2>
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							<For each={products.filter((p) => p.group === group.key)}>
								{(product) => <ProductCard product={product} />}
							</For>
						</div>
					</section>
				)}
			</For>
		</div>
	);
}
