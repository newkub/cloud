import { createFileRoute } from "@tanstack/solid-router";
import { Badge, Input } from "@wrikka/solid-ui";
import { createSignal, For, Show } from "solid-js";
import { PageHeader } from "../ci/ui";
import { ProductCard } from "../components/ProductCard";
import { isAvailable, productGroups, products } from "../data/products";

export const Route = createFileRoute("/products/")({ component: ProductsPage });

function ProductsPage() {
	const [query, setQuery] = createSignal("");
	const liveCount = () => products.filter(isAvailable).length;

	const groups = () => {
		const q = query().trim().toLowerCase();
		return productGroups
			.map((group) => ({
				...group,
				items: products.filter(
					(p) =>
						p.group === group.key &&
						(!q ||
							p.name.toLowerCase().includes(q) ||
							p.description.toLowerCase().includes(q)),
				),
			}))
			.filter((group) => group.items.length > 0);
	};

	return (
		<div class="mx-auto max-w-6xl px-6 py-8">
			<PageHeader
				title="Products"
				description="Build and scale with Wrikka Cloud infrastructure — every service ships with its own console."
				actions={
					<Input
						value={query()}
						onChange={setQuery}
						placeholder="Search products…"
						leftIcon={<span class="i-mdi:magnify" />}
						clearable
						class="w-full sm:w-64"
						aria-label="Search products"
					/>
				}
			/>

			<div class="mb-6 flex flex-wrap gap-2 text-xs text-dim">
				<Badge variant="default" class="gap-1.5">
					<span class="i-mdi:grid" />
					{products.length} products
				</Badge>
				<Badge variant="primary" class="gap-1.5">
					<span class="i-mdi:circle" />
					{liveCount()} live
				</Badge>
				<Badge variant="outline" class="gap-1.5">
					<span class="i-mdi:shape-outline" />
					{productGroups.length} categories
				</Badge>
			</div>

			<For each={groups()}>
				{(group) => (
					<section class="mb-8">
						<div class="mb-3 flex items-center gap-2">
							<h2 class="text-xs font-medium uppercase tracking-wider text-faint">
								{group.label}
							</h2>
							<span class="rounded-full border border-edge px-1.5 text-[10px] tabular-nums text-faint">
								{group.items.length}
							</span>
						</div>
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							<For each={group.items}>
								{(product) => <ProductCard product={product} />}
							</For>
						</div>
					</section>
				)}
			</For>

			<Show when={groups().length === 0}>
				<div class="rounded-xl border border-dashed border-edge bg-panel/50 px-6 py-14 text-center">
					<span class="i-mdi:package-variant-closed mx-auto text-3xl text-faint" />
					<p class="mt-3 text-sm text-fg">No products match “{query()}”</p>
					<p class="mt-1 text-sm text-dim">
						Try a different name or clear the search.
					</p>
				</div>
			</Show>
		</div>
	);
}
