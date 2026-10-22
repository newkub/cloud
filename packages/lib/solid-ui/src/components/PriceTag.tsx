/**
 * PriceTag — Intl-formatted price with compare-at strikethrough and period suffix.
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface PriceTagProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Price amount in major units */
	amount: number;
	/** ISO 4217 currency code @default "USD" */
	currency?: string;
	/** BCP 47 locale — defaults to the runtime locale */
	locale?: string;
	/** Compare-at price rendered with strikethrough */
	original?: number;
	/** Billing-period suffix, e.g. "/mo" */
	period?: string;
	/** Text size @default "md" */
	size?: "sm" | "md" | "lg" | "xl";
	/** Bolder, more prominent treatment @default false */
	emphasized?: boolean;
}

const sizeClass = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-xl",
	xl: "text-3xl",
} as const;

export function PriceTag(props: PriceTagProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"amount",
		"currency",
		"locale",
		"original",
		"period",
		"size",
		"emphasized",
	]);
	const format = (n: number) =>
		new Intl.NumberFormat(local.locale, {
			style: "currency",
			currency: local.currency ?? "USD",
		}).format(n);

	return (
		<span class={`solidui-price-tag inline-flex items-baseline gap-1.5 ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={local.original !== undefined}>
				<s class="font-normal text-muted-foreground">{format(local.original ?? 0)}</s>
			</Show>
			<span
				class={`tabular-nums text-foreground ${sizeClass[local.size ?? "md"]} ${local.emphasized ? "font-bold tracking-tight" : "font-semibold"}`}
			>
				{format(local.amount)}
			</span>
			<Show when={local.period}>
				<span class="text-muted-foreground">{local.period}</span>
			</Show>
		</span>
	);
}
