import { type Accessor, createMemo } from "solid-js";

export interface DateLocaleOptions {
	/** BCP-47 locale — defaults to the runtime locale. */
	locale?: string;
	/** IANA time zone, e.g. "Asia/Bangkok". */
	timeZone?: string;
	/** Intl.DateTimeFormat dateStyle. @default "medium" */
	dateStyle?: "full" | "long" | "medium" | "short";
	/** Intl.DateTimeFormat timeStyle — omit for date-only. */
	timeStyle?: "full" | "long" | "medium" | "short";
	/** RelativeTimeFormat numeric mode. @default "auto" */
	numeric?: "always" | "auto";
	/** RelativeTimeFormat style. @default "long" */
	relativeStyle?: "long" | "short" | "narrow";
}

/** Structured relative-time result returned by `relativeTime`. */
export interface RelativeTime {
	/** Rounded magnitude expressed in `unit` — negative = past, positive = future. */
	amount: number;
	/** Unit `amount` is expressed in. */
	unit: Intl.RelativeTimeFormatUnit;
	/** Locale string, e.g. "3 days ago". */
	text: string;
}

export interface RelativeTimeOptions {
	/** Reference point the value is compared to. @default Date.now() at call time */
	from?: Date | string | number;
	/** Per-call style override — falls back to `options.relativeStyle`. */
	style?: "long" | "short" | "narrow";
}

export interface DateLocaleFormatters {
	/** Locale-aware date/time string. */
	format: (value: Date | string | number) => string;
	/** "3 days ago"-style relative string. */
	relative: (value: Date | string | number) => string;
	/** Structured relative time — `{ amount, unit, text }` vs an optional `from`. */
	relativeTime: (value: Date | string | number, options?: RelativeTimeOptions) => RelativeTime;
	/** Locale-aware range string, e.g. "Sep 1 – 5, 2026" (falls back to `a – b`). */
	formatRange: (from: Date | string | number, to: Date | string | number) => string;
	/** Locale-aware number string. */
	number: (value: number, options?: Intl.NumberFormatOptions) => string;
	/** Resolved locale in use. */
	locale: Accessor<string>;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	["year", 31_536_000_000],
	["month", 2_592_000_000],
	["day", 86_400_000],
	["hour", 3_600_000],
	["minute", 60_000],
	["second", 1_000],
];

/**
 * Locale-aware Intl formatters shared by date/number components — one hook
 * gives consistent `format`, `relative`, `relativeTime`, `formatRange` and
 * `number` output for a locale + time zone.
 *
 * @param options — Locale, timeZone, date/time styles, relative numeric/style mode
 * @returns `{ format, relative, relativeTime, formatRange, number, locale }` formatters + resolved locale accessor
 *
 * @example
 * const d = useDateLocale({ locale: "th-TH", timeZone: "Asia/Bangkok" });
 * d.format(order.createdAt); // "14 ก.ย. 2569"
 * d.relative(order.createdAt); // "3 วันที่แล้ว"
 * d.relativeTime(due, { from: now }); // { amount: 2, unit: "hour", text: "ใน 2 ชั่วโมง" }
 * d.formatRange(start, end); // "1 – 5 ก.ย. 2569"
 */
export function useDateLocale(options: DateLocaleOptions = {}): DateLocaleFormatters {
	const locale = createMemo(() => options.locale ?? new Intl.DateTimeFormat().resolvedOptions().locale);
	const dtf = createMemo(
		() =>
			new Intl.DateTimeFormat(locale(), {
				dateStyle: options.dateStyle ?? "medium",
				timeStyle: options.timeStyle,
				timeZone: options.timeZone,
			}),
	);
	const rtf = createMemo(
		() =>
			new Intl.RelativeTimeFormat(locale(), {
				numeric: options.numeric ?? "auto",
				style: options.relativeStyle ?? "long",
			}),
	);
	const rtfs = new Map<string, Intl.RelativeTimeFormat>();
	const rtfFor = (style: "long" | "short" | "narrow") => {
		const base = options.relativeStyle ?? "long";
		if (style === base) return rtf();
		let f = rtfs.get(style);
		if (!f || f.resolvedOptions().locale !== locale()) {
			f = new Intl.RelativeTimeFormat(locale(), { numeric: options.numeric ?? "auto", style });
			rtfs.set(style, f);
		}
		return f;
	};

	const toDate = (v: Date | string | number) => (v instanceof Date ? v : new Date(v));

	const relativeTime = (value: Date | string | number, opts?: RelativeTimeOptions): RelativeTime => {
		const from = opts?.from === undefined ? Date.now() : toDate(opts.from).getTime();
		const diff = toDate(value).getTime() - from;
		const abs = Math.abs(diff);
		for (const [unit, ms] of UNITS) {
			if (abs >= ms) {
				const amount = Math.round(diff / ms);
				return { amount, unit, text: rtfFor(opts?.style ?? options.relativeStyle ?? "long").format(amount, unit) };
			}
		}
		return {
			amount: 0,
			unit: "second",
			text: rtfFor(opts?.style ?? options.relativeStyle ?? "long").format(0, "second"),
		};
	};

	return {
		format: (value) => dtf().format(toDate(value)),
		relative: (value) => relativeTime(value).text,
		relativeTime,
		formatRange: (from, to) => {
			const a = toDate(from);
			const b = toDate(to);
			const f = dtf();
			return typeof f.formatRange === "function" ? f.formatRange(a, b) : `${f.format(a)} – ${f.format(b)}`;
		},
		number: (value, fmt) => new Intl.NumberFormat(locale(), fmt).format(value),
		locale,
	};
}
