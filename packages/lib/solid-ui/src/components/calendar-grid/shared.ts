/** Grid math + shared classes for `CalendarGrid`. */
import { addDaysISO, parseISODate, toISODate, WEEKDAYS } from "../date-helpers";

export const cellSize = { sm: "h-7 w-7 text-2xs", md: "h-8 w-8 text-xs", lg: "h-9 w-9 text-sm" } as const;
export const navBtn =
	"flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";

/** 42 ISO day cells covering the viewed month incl. adjacent-month padding. */
export function monthCells(month: Date, weekStartsOn: 0 | 1): string[] {
	const first = new Date(month.getFullYear(), month.getMonth(), 1);
	const startOffset = (first.getDay() - weekStartsOn + 7) % 7;
	const start = new Date(first);
	start.setDate(1 - startOffset);
	return Array.from({ length: 42 }, (_, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		return toISODate(d);
	});
}

/** Weekday labels rotated so `weekStartsOn` is the first column. */
export function weekdayLabels(weekStartsOn: 0 | 1): string[] {
	return Array.from({ length: 7 }, (_, i) => WEEKDAYS[(i + weekStartsOn) % 7]);
}

/** Mon–Sun ISO bounds of the week containing `iso`, or null when unparseable. */
export function weekRangeOf(iso: string | undefined): [string, string] | null {
	const d = parseISODate(iso);
	if (!d) return null;
	const monday = new Date(d);
	monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
	return [toISODate(monday), addDaysISO(toISODate(monday), 6)];
}

/** ISO date of the first day of the week containing `iso`. */
export function startOfWeekISO(iso: string, weekStartsOn: 0 | 1): string {
	const d = parseISODate(iso);
	if (!d) return iso;
	const off = (d.getDay() - weekStartsOn + 7) % 7;
	d.setDate(d.getDate() - off);
	return toISODate(d);
}
