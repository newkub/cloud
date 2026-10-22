/**
 * DateText — Intl.DateTimeFormat wrapper for consistent date/time display.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type TextSize, type TextVariant, textSizes, textVariants } from "../lib/variants";

export interface DateTextProps extends JSX.HTMLAttributes<HTMLTimeElement> {
	value: Date | string | number;
	/** Text scale. @default "md" */
	size?: TextSize;
	/** Color tone. @default "default" */
	variant?: TextVariant;
	/** BCP-47 locale — defaults to the runtime locale. */
	locale?: string;
	dateStyle?: "full" | "long" | "medium" | "short";
	timeStyle?: "full" | "long" | "medium" | "short";
	/** IANA time zone, e.g. "Asia/Bangkok". */
	timeZone?: string;
	/** Append "(+Nd ago)"-style relative hint for past/future dates. */
	relative?: boolean;
	/** Fallback text when the date is invalid. @default "—" */
	fallback?: string;
}

function relativeHint(diffMs: number, locale?: string): string {
	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
	const abs = Math.abs(diffMs);
	const units: [Intl.RelativeTimeFormatUnit, number][] = [
		["year", 31_536_000_000],
		["month", 2_592_000_000],
		["day", 86_400_000],
		["hour", 3_600_000],
		["minute", 60_000],
		["second", 1_000],
	];
	for (const [unit, ms] of units) {
		if (abs >= ms) return rtf.format(Math.round(diffMs / ms), unit);
	}
	return rtf.format(0, "second");
}

export function DateText(props: DateTextProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"locale",
		"dateStyle",
		"timeStyle",
		"timeZone",
		"relative",
		"fallback",
		"size",
		"variant",
	]);
	const date = () => new Date(local.value);
	const valid = () => !Number.isNaN(date().getTime());
	const text = () => {
		if (!valid()) return local.fallback ?? "—";
		const base = new Intl.DateTimeFormat(local.locale, {
			dateStyle: local.dateStyle ?? "medium",
			timeStyle: local.timeStyle,
			timeZone: local.timeZone,
		}).format(date());
		return local.relative ? `${base} (${relativeHint(date().getTime() - Date.now(), local.locale)})` : base;
	};
	return (
		<Show
			when={valid()}
			fallback={
				<span class={`solidui-date-text text-muted-foreground ${local.class ?? ""}`}>{local.fallback ?? "—"}</span>
			}
		>
			<time
				datetime={date().toISOString()}
				class={`solidui-date-text ${textSizes[local.size ?? "md"]} ${textVariants[local.variant ?? "default"]} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				{text()}
			</time>
		</Show>
	);
}
