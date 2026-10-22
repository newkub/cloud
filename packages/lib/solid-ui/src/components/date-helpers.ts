/**
 * Shared ISO "YYYY-MM-DD" date helpers — used by DatePicker, DateRangePicker,
 * WeekPicker, MonthPicker and DateTimePicker. Re-exported from `./DatePicker`
 * for backwards compatibility; prefer importing from here directly.
 */

export const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTH_LONG = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const pad2 = (n: number) => String(n).padStart(2, "0");

/** Parse an ISO "YYYY-MM-DD" (or "YYYY-MM-DDT…") string into a local Date. Returns null when invalid. */
export function parseISODate(value: string | null | undefined): Date | null {
	if (!value) return null;
	const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
	if (!m) return null;
	const y = Number(m[1]);
	const mo = Number(m[2]);
	const d = Number(m[3]);
	const date = new Date(y, mo - 1, d);
	if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
	return date;
}

/** Format a Date as "YYYY-MM-DD". */
export function toISODate(d: Date): string {
	return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Today's date as "YYYY-MM-DD". */
export function todayISO(): string {
	return toISODate(new Date());
}

/** Add `days` to an ISO date string. */
export function addDaysISO(iso: string, days: number): string {
	const d = parseISODate(iso);
	if (!d) return iso;
	d.setDate(d.getDate() + days);
	return toISODate(d);
}

/** Add `months` to an ISO date string, clamping the day to the target month length. */
export function addMonthsISO(iso: string, months: number): string {
	const d = parseISODate(iso);
	if (!d) return iso;
	const day = d.getDate();
	d.setDate(1);
	d.setMonth(d.getMonth() + months);
	const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
	d.setDate(Math.min(day, dim));
	return toISODate(d);
}

/** Clamp an ISO date string to the [min, max] range (either bound optional). */
export function clampISODate(iso: string, min?: string, max?: string): string {
	if (min && iso < min.slice(0, 10)) return min.slice(0, 10);
	if (max && iso > max.slice(0, 10)) return max.slice(0, 10);
	return iso;
}

/** Format an ISO date string using tokens: YYYY, YY, MMMM, MMM, MM, M, DD, D. */
export function formatISODate(iso: string, format: string): string {
	const d = parseISODate(iso);
	if (!d) return iso;
	const tokens: Record<string, string> = {
		YYYY: String(d.getFullYear()),
		YY: String(d.getFullYear()).slice(-2),
		MMMM: MONTH_LONG[d.getMonth()],
		MMM: MONTH_SHORT[d.getMonth()],
		MM: pad2(d.getMonth() + 1),
		M: String(d.getMonth() + 1),
		DD: pad2(d.getDate()),
		D: String(d.getDate()),
	};
	return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D/g, (t) => tokens[t] ?? t);
}

/** Parse free text using the same tokens as {@link formatISODate}. Returns ISO or null. */
export function parseByFormat(text: string, format: string): string | null {
	const tokenRe: Record<string, string> = {
		YYYY: "(\\d{4})",
		YY: "(\\d{2})",
		MMMM: `(${MONTH_LONG.join("|")})`,
		MMM: `(${MONTH_SHORT.join("|")})`,
		MM: "(\\d{1,2})",
		M: "(\\d{1,2})",
		DD: "(\\d{1,2})",
		D: "(\\d{1,2})",
	};
	const keys: string[] = [];
	const pattern = format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|./g, (t) => {
		const re = tokenRe[t];
		if (re) {
			keys.push(t);
			return re;
		}
		return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	});
	const m = new RegExp(`^${pattern}$`, "i").exec(text.trim());
	if (!m) return null;
	let year = 0;
	let month = 0;
	let day = 0;
	keys.forEach((k, i) => {
		const v = m[i + 1];
		if (k === "YYYY") year = Number(v);
		else if (k === "YY") year = 2000 + Number(v);
		else if (k === "MMMM") month = MONTH_LONG.findIndex((n) => n.toLowerCase() === v.toLowerCase()) + 1;
		else if (k === "MMM") month = MONTH_SHORT.findIndex((n) => n.toLowerCase() === v.toLowerCase()) + 1;
		else if (k === "MM" || k === "M") month = Number(v);
		else day = Number(v);
	});
	if (!year || !month || !day) return null;
	const iso = `${year}-${pad2(month)}-${pad2(day)}`;
	return parseISODate(iso) ? iso : null;
}

/** First day of the given date's month. */
export function firstOfMonth(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), 1);
}
