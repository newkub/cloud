import { type Accessor, createMemo } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface TimeZoneState {
	/** IANA zone name reported by `Intl.DateTimeFormat` (e.g. `"Asia/Bangkok"`) */
	timeZone: Accessor<string>;
	/**
	 * Minutes to *add* to local time to reach UTC — mirrors
	 * `Date#getTimezoneOffset`, so it is positive west of Greenwich and
	 * negative east of it (`Asia/Bangkok` → `-420`).
	 */
	offsetMinutes: Accessor<number>;
	/** `offsetMinutes / 60` — fractional for half-hour zones */
	offsetHours: Accessor<number>;
}

/**
 * Local time-zone info — the IANA `timeZone` name plus UTC `offsetMinutes`
 * and `offsetHours` accessors. Pass `at` (a `Date` or accessor) to read the
 * offset for a specific instant so daylight-saving transitions resolve
 * correctly. SSR-safe: uses only `Intl` and `Date`.
 *
 * @param at — Instant to evaluate the offset at. @default current date
 * @returns `{ timeZone, offsetMinutes, offsetHours }` accessors
 *
 * @example
 * const tz = useTimeZone();
 * <p>{tz.timeZone()} — UTC{tz.offsetHours() <= 0 ? `+${-tz.offsetHours()}` : `-${tz.offsetHours()}`}</p>
 */
export function useTimeZone(at?: MaybeAccessor<Date>): TimeZoneState {
	const timeZone = createMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC");
	const offsetMinutes = createMemo(() => (at === undefined ? new Date() : read(at)).getTimezoneOffset());
	const offsetHours = createMemo(() => offsetMinutes() / 60);

	return { timeZone, offsetMinutes, offsetHours };
}
