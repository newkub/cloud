import { type Accessor, createMemo } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";
import { useNow } from "./useNow";

export type ClockFormat = "12h" | "24h";

export interface ClockState {
	/** Formatted time string — `"14:05:09"` or `"2:05:09 PM"` */
	time: Accessor<string>;
	/** Raw current `Date` */
	date: Accessor<Date>;
	/** Current hour — 0–23 regardless of `format` */
	hours: Accessor<number>;
	/** Current minute (0–59) */
	minutes: Accessor<number>;
	/** Current second (0–59) */
	seconds: Accessor<number>;
}

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live wall clock — a formatted `time` string plus numeric `hours`,
 * `minutes`, `seconds` accessors, refreshed once per second. `format`
 * may be an accessor to switch between `"12h"` and `"24h"` reactively.
 *
 * @param format — `"12h"` appends AM/PM; `"24h"` zero-pads. @default "24h"
 * @returns `{ time, date, hours, minutes, seconds }` accessors
 *
 * @example
 * const clock = useClock("12h");
 * <p>{clock.time()}</p>
 */
export function useClock(format: MaybeAccessor<ClockFormat> = "24h"): ClockState {
	const date = useNow(1_000);

	const hours = createMemo(() => date().getHours());
	const minutes = createMemo(() => date().getMinutes());
	const seconds = createMemo(() => date().getSeconds());
	const time = createMemo(() => {
		if (read(format) === "12h") {
			const ampm = hours() >= 12 ? "PM" : "AM";
			return `${hours() % 12 || 12}:${pad(minutes())}:${pad(seconds())} ${ampm}`;
		}
		return `${pad(hours())}:${pad(minutes())}:${pad(seconds())}`;
	});

	return { time, date, hours, minutes, seconds };
}
