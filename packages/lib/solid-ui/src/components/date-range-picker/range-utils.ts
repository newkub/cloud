/**
 * Range endpoint helpers — combine the [minDate, maxDate] bounds with the
 * peer endpoint so start ≤ end always holds.
 */
import { clampISODate } from "../date-helpers";

/** Latest valid start date: the earlier of the picked end and maxDate. */
export function rangeStartMax(end: string, maxDate?: string): string | undefined {
	const c = [end, maxDate].filter(Boolean).sort();
	return c[0] || undefined;
}

/** Earliest valid end date: the later of the picked start and minDate. */
export function rangeEndMin(start: string, minDate?: string): string | undefined {
	const c = [start, minDate].filter(Boolean).sort();
	return c[c.length - 1] || undefined;
}

/** Clamp a typed start into [minDate, maxDate], never after `end`. */
export function clampRangeStart(v: string, end: string, minDate?: string, maxDate?: string): string {
	const clamped = clampISODate(v, minDate, maxDate);
	return end && clamped > end ? end : clamped;
}

/** Clamp a typed end into [minDate, maxDate], never before `start`. */
export function clampRangeEnd(v: string, start: string, minDate?: string, maxDate?: string): string {
	const clamped = clampISODate(v, minDate, maxDate);
	return start && clamped < start ? start : clamped;
}
