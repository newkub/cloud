import { Link } from "@tanstack/solid-router";
import { Badge } from "@wrikka/solid-ui";
import { For, Show } from "solid-js";
import {
	isAvailable,
	type Product,
	productGroups,
	products,
} from "../data/products";

const cardClass =
	"group flex flex-col gap-3 rounded-xl border border-edge bg-panel p-4 transition-colors hover:border-acc/40 hover:bg-raise";

export function ServicesTab() {
	const live = () => products.filter(isAvailable);
	const preview = () => products.filter((p) => !isAvailable(p));

	return (
		<div class="space-y-8">
			<section>
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-sm font-medium text-fg">Live services</h2>
					<span class="text-xs text-faint">{live().length} available</span>
				</div>
				<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					<For each={live()}>
						{(product) => (
							<Link
								to="/products/$slug"
								params={{ slug: product.key }}
								class={cardClass}
							>
								<div class="flex items-center gap-3">
									<span class="flex h-10 w-10 items-center justify-center rounded-lg border border-acc/30 bg-acc/10 text-xl text-acc">
										<span class={product.icon} />
									</span>
									<div class="min-w-0 flex-1">
										<h3 class="truncate text-sm font-medium text-fg">
											{product.name}
										</h3>
										<span class="text-[11px] font-medium text-acc">live</span>
									</div>
									<span class="i-mdi:arrow-top-right text-dim transition-colors group-hover:text-acc" />
								</div>
								<p class="text-[13px] leading-relaxed text-dim">
									{product.description}
								</p>
								<div class="mt-auto flex flex-wrap gap-1.5">
									<span class="rounded-full border border-edge bg-ink px-2 py-0.5 text-[10px] text-faint">
										{productGroups.find((g) => g.key === product.group)
											?.label ?? product.group}
									</span>
								</div>
							</Link>
						)}
					</For>
				</div>
			</section>

			<Show when={preview().length > 0}>
				<section>
					<div class="mb-3 flex items-center justify-between">
						<h2 class="text-sm font-medium text-fg">In preview</h2>
						<span class="text-xs text-faint">
							{preview().length} coming soon
						</span>
					</div>
					<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						<For each={preview()}>
							{(product) => (
								<Link
									to="/products/$slug"
									params={{ slug: product.key }}
									class="flex items-center gap-3 rounded-xl border border-dashed border-edge bg-panel/50 px-4 py-3 transition-colors hover:border-edge hover:bg-panel"
								>
									<span class={`${product.icon} text-lg text-faint`} />
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm text-dim">{product.name}</p>
										<p class="text-[11px] text-faint">
											{productGroups.find((g) => g.key === product.group)
												?.label ?? product.group}
										</p>
									</div>
									<span class="i-mdi:chevron-right text-faint" />
								</Link>
							)}
						</For>
					</div>
				</section>
			</Show>

			<section>
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-sm font-medium text-fg">All services by category</h2>
					<Link
						to="/products"
						class="text-xs text-dim transition-colors hover:text-acc"
					>
						Browse catalog →
					</Link>
				</div>
				<div class="space-y-4">
					<For each={productGroups}>
						{(group) => {
							const items = () => products.filter((p) => p.group === group.key);
							return (
								<Show when={items().length > 0}>
									<div class="rounded-xl border border-edge bg-panel p-4">
										<div class="mb-3 flex items-center gap-2">
											<span class="text-[11px] font-medium uppercase tracking-wider text-faint">
												{group.label}
											</span>
											<Badge variant="default" size="sm">
												{items().length}
											</Badge>
										</div>
										<div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
											<For each={items()}>
												{(product) => (
													<ServiceRow product={product} group={group.label} />
												)}
											</For>
										</div>
									</div>
								</Show>
							);
						}}
					</For>
				</div>
			</section>
		</div>
	);
}

function ServiceRow(props: { product: Product; group: string }) {
	return (
		<Link
			to="/products/$slug"
			params={{ slug: props.product.key }}
			class="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-raise"
		>
			<span
				class={`${props.product.icon} shrink-0 text-base ${
					isAvailable(props.product) ? "text-acc" : "text-faint"
				}`}
			/>
			<div class="min-w-0 flex-1">
				<p class="truncate text-[13px] text-fg">{props.product.name}</p>
				<p class="truncate text-[11px] text-faint">{props.group}</p>
			</div>
			<span
				class={`shrink-0 text-[10px] font-medium ${
					isAvailable(props.product) ? "text-acc" : "text-faint"
				}`}
			>
				{isAvailable(props.product) ? "live" : "soon"}
			</span>
		</Link>
	);
}
