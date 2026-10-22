import type { WeekValue } from "./types";

/** ISO 8601 week number of a date. */
export function isoWeek(date: Date): WeekValue {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const day = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - day);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return { year: d.getUTCFullYear(), week: Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7) };
}

/** Monday of a given ISO week. */
export function weekStart(year: number, week: number): Date {
	const jan4 = new Date(Date.UTC(year, 0, 4));
	const day = jan4.getUTCDay() || 7;
	const monday = new Date(jan4);
	monday.setUTCDate(jan4.getUTCDate() - day + 1 + (week - 1) * 7);
	return monday;
}

export function weeksInYear(year: number): number {
	const jan1 = new Date(Date.UTC(year, 0, 1));
	const day = jan1.getUTCDay();
	return day === 4 || (day === 3 && new Date(Date.UTC(year, 11, 31)).getUTCDay() === 4) ? 53 : 52;
}
