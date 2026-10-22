/**
 * FormatNumber — Intl.NumberFormat wrapper for consistent numeric display.
 */
import { type JSX, splitProps } from "solid-js";
import { type TextSize, type TextVariant, textSizes, textVariants } from "../lib/variants";

export interface FormatNumberProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	value: number;
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** BCP-47 locale — defaults to the runtime locale. */
	locale?: string;
	/** Number style. @default "decimal" */
	style?: "decimal" | "currency" | "percent" | "unit";
	/** ISO currency for style="currency", e.g. "USD". */
	currency?: string;
	/** Unit for style="unit", e.g. "kilometer". */
	unit?: string;
	/** Compact notation ("K"/"M" abbreviations). */
	notation?: "standard" | "compact" | "scientific" | "engineering";
	/** Always show + sign for positive values. */
	signDisplay?: "auto" | "always" | "exceptZero" | "never";
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
	/** Tabular figures for aligned columns. @default true */
	tabular?: boolean;
	/** Value used as-is when formatting throws (e.g. bad currency). */
	fallback?: string;
}

export function FormatNumber(props: FormatNumberProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"locale",
		"style",
		"currency",
		"unit",
		"notation",
		"signDisplay",
		"minimumFractionDigits",
		"maximumFractionDigits",
		"tabular",
		"fallback",
		"size",
		"variant",
	]);
	const text = () => {
		try {
			return new Intl.NumberFormat(local.locale, {
				style: local.style ?? "decimal",
				currency: local.currency,
				unit: local.unit,
				notation: local.notation,
				signDisplay: local.signDisplay,
				minimumFractionDigits: local.minimumFractionDigits,
				maximumFractionDigits: local.maximumFractionDigits,
			}).format(local.value);
		} catch {
			return local.fallback ?? String(local.value);
		}
	};
	return (
		<span
			class={`solidui-format-number ${(local.tabular ?? true) ? "tabular-nums" : ""} ${textSizes[local.size ?? "md"]} ${textVariants[local.variant ?? "default"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{text()}
		</span>
	);
}
