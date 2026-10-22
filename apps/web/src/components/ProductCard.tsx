import { Link } from "@tanstack/solid-router";
import { isAvailable, type Product } from "../data/products";
import { StatusBadge } from "./StatusBadge";

export function ProductCard(props: { product: Product }) {
	const live = () => isAvailable(props.product);
	return (
		<Link
			to="/products/$slug"
			params={{ slug: props.product.key }}
			class="group flex flex-col gap-4 rounded-xl border border-edge bg-panel p-4 hover:border-acc/40 hover:bg-raise"
		>
			<div class="flex items-start justify-between">
				<span
					class={`flex h-9 w-9 items-center justify-center rounded-lg border border-edge bg-ink text-xl ${
						live() ? "text-acc" : "text-faint group-hover:text-dim"
					}`}
				>
					<span class={props.product.icon} />
				</span>
				<StatusBadge status={props.product.status} />
			</div>
			<div>
				<h3 class="text-sm font-medium text-fg">{props.product.name}</h3>
				<p class="mt-1 text-[13px] leading-relaxed text-dim">
					{props.product.description}
				</p>
			</div>
		</Link>
	);
}
