/**
 * CurrencyInput — number input with a currency symbol prefix and blur formatting.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface CurrencyInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onInput" | "value" | "size"> {
	/** Controlled numeric value */
	value?: number;
	defaultValue?: number;
	/** Currency symbol shown as prefix @default "$" */
	currency?: string;
	/** Locale used for formatting on blur, e.g. "en-US" */
	locale?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: number) => void;
	/** Corner radius. */
	radius?: Radius;
}

const sizeClass = { sm: "h-8 text-xs", md: "h-9 text-sm", lg: "h-10 text-sm" } as const;

export function CurrencyInput(props: CurrencyInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"currency",
		"locale",
		"variant",
		"size",
		"onChange",
		"disabled",
		"radius",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? 0);
	const [focused, setFocused] = createSignal(false);
	const value = () => local.value ?? internal();
	const display = () =>
		focused() ? String(value()) : value().toLocaleString(local.locale, { minimumFractionDigits: 0 });
	const commit = (raw: string) => {
		const n = Number(raw.replace(/[^\d.-]/g, ""));
		if (Number.isNaN(n)) return;
		setInternal(n);
		local.onChange?.(n);
	};
	return (
		<div
			class={`solidui-currency-input inline-flex items-center overflow-hidden border ${inputVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "md"]} ${local.class ?? ""}`.trim()}
		>
			<span class="pl-3 text-muted-foreground text-sm">{local.currency ?? "$"}</span>
			<input
				type="text"
				inputmode="decimal"
				disabled={local.disabled}
				class={`w-full min-w-0 border-0 bg-transparent px-2 ${sizeClass[local.size ?? "md"]} text-foreground focus-visible:outline-none disabled:opacity-50`}
				value={display()}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				onInput={(e) => commit(e.currentTarget.value)}
				{...rest}
			/>
		</div>
	);
}
