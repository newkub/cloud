/**
 * CartDrawer — right-edge slide-over cart panel with qty steppers, subtotal and checkout CTA.
 */

import { createFocusTrap, useEscapeKey } from "@wrikka/hooks";
import { createSignal, For, type JSX, mergeProps, onCleanup, onMount, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { CartItem } from "./CartItem";

export interface CartDrawerItem {
	/** Line item id — passed to qty/remove handlers. */
	id: string;
	name: string;
	/** Unit price in major units. */
	price: number;
	quantity: number;
	image?: string;
	/** Variant/spec text, e.g. "M · Black". */
	meta?: string;
	maxQuantity?: number;
}

export interface CartDrawerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled open state. @default false */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	items: CartDrawerItem[];
	/** Called with item id and the new quantity. */
	onQuantityChange?: (id: string, qty: number) => void;
	/** Called with item id when remove (or qty → 0) is requested. */
	onRemove?: (id: string) => void;
	onCheckout?: () => void;
	/** Panel heading. @default "Your cart" */
	title?: string;
	/** Currency symbol prepended to formatted prices. @default "$" */
	currency?: string;
	/** Checkout button label. @default "Checkout" */
	checkoutLabel?: string;
	/** Empty-state text. @default "Your cart is empty" */
	emptyText?: string;
}

function CartDrawerContent(props: CartDrawerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"items",
		"onQuantityChange",
		"onRemove",
		"onCheckout",
		"onOpenChange",
		"title",
		"currency",
		"checkoutLabel",
		"emptyText",
	]);
	const [entered, setEntered] = createSignal(false);
	let panelRef: HTMLDivElement | undefined;

	useEscapeKey(() => local.onOpenChange?.(false));

	onMount(() => {
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const trap = panelRef ? createFocusTrap(panelRef) : null;
		trap?.activate();

		const raf =
			typeof requestAnimationFrame === "function"
				? requestAnimationFrame(() => setEntered(true))
				: (setTimeout(() => setEntered(true), 10) as unknown as number);

		onCleanup(() => {
			document.body.style.overflow = prevOverflow;
			trap?.deactivate();
			if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(raf);
			else clearTimeout(raf);
		});
	});

	const fmt = (n: number) => `${local.currency ?? "$"}${n.toFixed(2)}`;
	const subtotal = () => local.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
	const count = () => local.items.reduce((sum, it) => sum + it.quantity, 0);

	return (
		<Portal>
			<div
				class="fixed inset-0 z-modal-backdrop bg-overlay/60 motion-safe:animate-[su-fade-in_var(--su-transition-normal)]"
				onClick={() => local.onOpenChange?.(false)}
				aria-hidden="true"
			/>
			<div
				ref={(el) => (panelRef = el)}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-label={local.title ?? "Your cart"}
				class={`solidui-cart-drawer fixed inset-y-0 right-0 z-modal flex w-full max-w-sm transform flex-col border-l border-border bg-surface text-foreground shadow-xl transition-transform duration-200 motion-reduce:transition-none ${entered() ? "translate-x-0" : "translate-x-full"} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<div class="flex items-center justify-between border-b border-border px-4 py-3">
					<h2 class="text-sm font-semibold">
						{local.title ?? "Your cart"}
						<Show when={count() > 0}>
							<span class="ml-1.5 text-xs font-normal text-muted-foreground">({count()})</span>
						</Show>
					</h2>
					<button
						type="button"
						aria-label="Close cart"
						class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => local.onOpenChange?.(false)}
					>
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
						</svg>
					</button>
				</div>
				<div class="flex-1 overflow-y-auto px-4 py-3">
					<Show
						when={local.items.length > 0}
						fallback={
							<p class="flex h-full items-center justify-center text-sm text-muted-foreground">
								{local.emptyText ?? "Your cart is empty"}
							</p>
						}
					>
						<ul class="flex flex-col divide-y divide-border">
							<For each={local.items}>
								{(item) => (
									<li class="py-3 first:pt-0 last:pb-0">
										<CartItem
											name={item.name}
											price={item.price}
											quantity={item.quantity}
											image={item.image}
											meta={item.meta}
											maxQuantity={item.maxQuantity}
											currency={local.currency ?? "$"}
											onQuantityChange={(qty) => local.onQuantityChange?.(item.id, qty)}
											onRemove={local.onRemove ? () => local.onRemove?.(item.id) : undefined}
										/>
									</li>
								)}
							</For>
						</ul>
					</Show>
				</div>
				<div class="border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
					<div class="mb-3 flex items-center justify-between text-sm">
						<span class="text-muted-foreground">Subtotal</span>
						<span class="font-semibold tabular-nums">{fmt(subtotal())}</span>
					</div>
					<button
						type="button"
						disabled={local.items.length === 0}
						class="flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
						onClick={() => local.onCheckout?.()}
					>
						{local.checkoutLabel ?? "Checkout"}
					</button>
				</div>
			</div>
		</Portal>
	);
}

export function CartDrawer(props: CartDrawerProps) {
	const merged = mergeProps({ open: false }, props);
	return (
		<Show when={merged.open}>
			<CartDrawerContent {...merged} />
		</Show>
	);
}
