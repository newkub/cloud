/**
 * CartItem — cart line item with image, qty stepper and remove.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface CartItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	name: string;
	/** Unit price — formatted string or number. */
	price: string | number;
	quantity: number;
	onQuantityChange?: (qty: number) => void;
	onRemove?: () => void;
	image?: string;
	/** Variant/spec text, e.g. "M · Black". */
	meta?: string;
	/** Per-unit currency applied when price is a number. */
	currency?: string;
	maxQuantity?: number;
	size?: "sm" | "md" | "lg";
	/** Corner radius on image. */
	radius?: Radius;
	disabled?: boolean;
}

const imgSize = { sm: "h-10 w-10", md: "h-14 w-14", lg: "h-16 w-16" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function CartItem(props: CartItemProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"name",
		"price",
		"quantity",
		"onQuantityChange",
		"onRemove",
		"image",
		"meta",
		"currency",
		"maxQuantity",
		"size",
		"radius",
		"disabled",
	]);
	const fmt = (p: string | number) => (typeof p === "number" ? `${local.currency ?? "$"}${p.toFixed(2)}` : p);
	const setQty = (q: number) => {
		const clamped = Math.min(local.maxQuantity ?? 99, Math.max(0, q));
		if (clamped === 0) local.onRemove?.();
		else local.onQuantityChange?.(clamped);
	};
	const stepper = (dir: 1 | -1, label: string, path: string) => (
		<button
			type="button"
			disabled={local.disabled}
			aria-label={label}
			class="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40"
			onClick={() => setQty(local.quantity + dir)}
		>
			<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d={path} stroke-linecap="round" />
			</svg>
		</button>
	);
	return (
		<div class={`solidui-cart-item flex items-center gap-3 ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={local.image}>
				<img
					src={local.image}
					alt={local.name}
					class={`shrink-0 object-cover ${imgSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]}`}
				/>
			</Show>
			<div class="min-w-0 flex-1">
				<div class={`font-medium text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>{local.name}</div>
				<Show when={local.meta}>
					<div class="text-2xs text-muted-foreground">{local.meta}</div>
				</Show>
				<div class={`mt-0.5 text-muted-foreground ${textSize[local.size ?? "md"]}`}>{fmt(local.price)}</div>
			</div>
			<div class={`flex items-center border border-border ${radiusMap[local.radius ?? "md"]}`}>
				{stepper(-1, "Decrease quantity", "M5 12h14")}
				<span class={`w-7 text-center font-medium tabular-nums text-foreground ${textSize[local.size ?? "md"]}`}>
					{local.quantity}
				</span>
				{stepper(1, "Increase quantity", "M12 5v14M5 12h14")}
			</div>
			<Show when={local.onRemove}>
				<button
					type="button"
					aria-label={`Remove ${local.name}`}
					class="shrink-0 text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					onClick={() => local.onRemove?.()}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path
							d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</Show>
		</div>
	);
}
