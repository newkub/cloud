/**
 * CardInput — payment card number input with spacing, brand detection and Luhn check.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

/** Detect card brand from the leading digits. */
export function detectBrand(number: string): CardBrand {
	const n = number.replace(/\D/g, "");
	if (/^4/.test(n)) return "visa";
	if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
	if (/^3[47]/.test(n)) return "amex";
	if (/^6/.test(n)) return "discover";
	return "unknown";
}

/** Luhn checksum validation. */
export function luhnValid(number: string): boolean {
	const n = number.replace(/\D/g, "");
	if (n.length < 13) return false;
	let sum = 0;
	let dbl = false;
	for (let i = n.length - 1; i >= 0; i--) {
		let d = Number(n[i]);
		if (dbl) {
			d *= 2;
			if (d > 9) d -= 9;
		}
		sum += d;
		dbl = !dbl;
	}
	return sum % 10 === 0;
}

/** Group digits: 4-4-4-4 (amex 4-6-5). */
export function formatCardNumber(number: string): string {
	const n = number.replace(/\D/g, "").slice(0, 19);
	if (/^3[47]/.test(n))
		return n.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
	return n.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export interface CardInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "onInput" | "type"> {
	value?: string;
	/** Called with the digits-only number. */
	onChange?: (value: string, brand: CardBrand) => void;
	/** Called when the detected brand changes (including to "unknown"). */
	onBrandChange?: (brand: CardBrand) => void;
	/** Show the detected brand name. @default true */
	showBrand?: boolean;
	/** Enable brand detection and the brand badge. @default true */
	brandDetection?: boolean;
	/** Flag invalid (Luhn) numbers once they reach full length. @default true */
	validate?: boolean;
	/** External error — boolean styles the field, a string also renders a message. */
	error?: boolean | string;
	/** Prevent editing while keeping the value visible. @default false */
	readOnly?: boolean;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

const sizeClass = { sm: "h-8 px-2 text-xs", md: "h-9 px-3 text-sm", lg: "h-10 px-3 text-base" } as const;

export function CardInput(props: CardInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"onChange",
		"onBrandChange",
		"showBrand",
		"brandDetection",
		"validate",
		"error",
		"readOnly",
		"fullWidth",
		"variant",
		"size",
		"radius",
		"disabled",
		"placeholder",
	]);

	const digits = () => (local.value ?? "").replace(/\D/g, "");
	const brand = () => ((local.brandDetection ?? true) ? detectBrand(digits()) : "unknown");
	const luhnBad = () => (local.validate ?? true) && digits().length >= 15 && !luhnValid(digits());
	const invalid = () => luhnBad() || Boolean(local.error);
	const errorMsg = () => (typeof local.error === "string" ? local.error : undefined);

	return (
		<div class={`solidui-card-input ${local.fullWidth ? "w-full" : "inline-block"}`.trim()}>
			<div
				class={`relative inline-flex w-full items-center overflow-hidden border focus-within:ring-1 focus-within:ring-ring ${inputVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "md"]} ${
					invalid() ? "border-destructive" : ""
				} ${local.class ?? ""}`.trim()}
			>
				<input
					type="text"
					inputmode="numeric"
					autocomplete="cc-number"
					disabled={local.disabled}
					readOnly={local.readOnly}
					placeholder={local.placeholder ?? "1234 5678 9012 3456"}
					aria-invalid={invalid() || undefined}
					class={`w-full min-w-0 border-0 bg-transparent ${sizeClass[local.size ?? "md"]} tabular-nums text-foreground focus-visible:outline-none disabled:opacity-50`}
					value={formatCardNumber(digits())}
					onInput={(e) => {
						const d = e.currentTarget.value.replace(/\D/g, "").slice(0, 19);
						const b = detectBrand(d);
						if (b !== brand()) local.onBrandChange?.(b);
						local.onChange?.(d, (local.brandDetection ?? true) ? b : "unknown");
					}}
					{...rest}
				/>
				<Show when={(local.showBrand ?? true) && brand() !== "unknown"}>
					<span class="pr-3 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">{brand()}</span>
				</Show>
			</div>
			<Show when={errorMsg() ?? (luhnBad() ? "invalid" : undefined)}>
				<span class="mt-1 block text-xs text-destructive" role="alert">
					{errorMsg() ?? "Card number is invalid"}
				</span>
			</Show>
		</div>
	);
}
