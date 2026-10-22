import type { ProductStatus } from "../data/products";

export function StatusBadge(props: { status: ProductStatus }) {
	return props.status === "available" ? (
		<span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-acc">
			<span class="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acc" />
			live
		</span>
	) : (
		<span class="rounded border border-edge px-1.5 py-px text-[10px] font-medium uppercase tracking-wider text-faint">
			soon
		</span>
	);
}
