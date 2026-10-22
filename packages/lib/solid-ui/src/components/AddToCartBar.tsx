/**
 * AddToCartBar - sticky buy bar with price, quantity stepper and CTA.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap } from "../lib/variants";
import { Button } from "./Button";
import { StepperInput } from "./StepperInput";

export interface AddToCartBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Display price. */
	price: string;
	/** Quantity value. */
	quantity?: number;
	/** Called on quantity change. */
	onQuantityChange?: (q: number) => void;
	/** Called on CTA click. */
	onAdd?: () => void;
	/** CTA label. @default "Add to cart" */
	label?: string;
	/** Pin to viewport bottom. Set false inside preview frames. @default true */
	fixed?: boolean;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function AddToCartBar(props: AddToCartBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"price",
		"quantity",
		"onQuantityChange",
		"onAdd",
		"label",
		"fixed",
		"elevation",
	]);

	const className = () =>
		[
			"solidui-add-to-cart-bar flex items-center gap-3 border border-border bg-popover px-4 py-3",
			(local.fixed ?? true) ? "fixed inset-x-0 bottom-0 z-fixed rounded-none border-x-0 border-b-0" : "rounded-lg",
			elevationMap[local.elevation ?? "lg"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<span class="text-lg font-semibold text-foreground">{local.price}</span>
			<span class="flex-1" />
			<StepperInput value={local.quantity ?? 1} min={1} onChange={(v) => local.onQuantityChange?.(v)} />
			<Button variant="primary" onClick={local.onAdd}>
				{local.label ?? "Add to cart"}
			</Button>
		</div>
	);
}
