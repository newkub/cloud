/**
 * CreditCardInput — grouped card number, MM/YY expiry mask, CVC and brand detection.
 */
import { createMemo, createSignal, createUniqueId, type JSX, splitProps } from "solid-js";

export interface CreditCardValue {
	number: string;
	expiry: string;
	cvc: string;
}

const EMPTY: CreditCardValue = { number: "", expiry: "", cvc: "" };

type Brand = "visa" | "mastercard" | "amex" | "unknown";

const detectBrand = (digits: string): Brand => {
	if (/^3[47]/.test(digits)) return "amex";
	if (/^4/.test(digits)) return "visa";
	if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
	return "unknown";
};

const formatNumber = (raw: string) =>
	raw
		.replace(/\D/g, "")
		.slice(0, 19)
		.replace(/(.{4})/g, "$1 ")
		.trim();

const formatExpiry = (raw: string) => {
	const digits = raw.replace(/\D/g, "").slice(0, 4);
	if (digits.length <= 2) return digits;
	return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const formatCvc = (raw: string) => raw.replace(/\D/g, "").slice(0, 4);

export interface CreditCardInputProps
	extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onInput" | "value"> {
	/** Controlled card value. */
	value?: CreditCardValue;
	/** Initial value for uncontrolled usage. */
	defaultValue?: CreditCardValue;
	/** Called with the next card value on any field edit. */
	onChange?: (value: CreditCardValue) => void;
}

export function CreditCardInput(props: CreditCardInputProps) {
	const [local, rest] = splitProps(props, ["class", "value", "defaultValue", "onChange"]);
	const id = `solidui-credit-card-input-${createUniqueId()}`;
	const [internal, setInternal] = createSignal<CreditCardValue>(local.defaultValue ?? { ...EMPTY });
	const value = () => local.value ?? internal();
	const brand = createMemo<Brand>(() => detectBrand(value().number.replace(/\D/g, "")));

	const update = (key: keyof CreditCardValue, next: string) => {
		const merged = { ...value(), [key]: next };
		if (local.value === undefined) setInternal(merged);
		local.onChange?.(merged);
	};

	const inputCls =
		"h-9 w-full rounded-md border border-input bg-background px-3 text-sm tabular-nums text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

	const brandBadge = () => (
		<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
			<span class="rounded border border-border bg-muted px-1.5 py-0.5 text-2xs font-semibold uppercase text-muted-foreground">
				{brand() === "unknown" ? "card" : brand() === "mastercard" ? "MC" : brand()}
			</span>
		</span>
	);

	return (
		<div class={`solidui-credit-card-input flex flex-col gap-3 ${local.class ?? ""}`} {...rest}>
			<div class="flex flex-col gap-1">
				<label for={`${id}-number`} class="text-sm font-medium text-foreground">
					Card number
				</label>
				<div class="relative">
					<input
						id={`${id}-number`}
						type="text"
						inputmode="numeric"
						class={`${inputCls} pr-14`}
						placeholder="1234 5678 9012 3456"
						value={value().number}
						onInput={(e) => update("number", formatNumber(e.currentTarget.value))}
					/>
					{brandBadge()}
				</div>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1">
					<label for={`${id}-expiry`} class="text-sm font-medium text-foreground">
						Expiry
					</label>
					<input
						id={`${id}-expiry`}
						type="text"
						inputmode="numeric"
						class={inputCls}
						placeholder="MM/YY"
						value={value().expiry}
						onInput={(e) => update("expiry", formatExpiry(e.currentTarget.value))}
					/>
				</div>
				<div class="flex flex-col gap-1">
					<label for={`${id}-cvc`} class="text-sm font-medium text-foreground">
						CVC
					</label>
					<input
						id={`${id}-cvc`}
						type="text"
						inputmode="numeric"
						class={inputCls}
						placeholder={brand() === "amex" ? "1234" : "123"}
						value={value().cvc}
						onInput={(e) => update("cvc", formatCvc(e.currentTarget.value))}
					/>
				</div>
			</div>
		</div>
	);
}
