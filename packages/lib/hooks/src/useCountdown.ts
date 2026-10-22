import { type Accessor, createMemo } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";
import { useNow } from "./useNow";

export interface CountdownState {
	/** Whole days remaining */
	days: Accessor<number>;
	/** Hours remaining within the current day (0–23) */
	hours: Accessor<number>;
	/** Minutes remaining within the current hour (0–59) */
	minutes: Accessor<number>;
	/** Seconds remaining within the current minute (0–59) */
	seconds: Accessor<number>;
	/** True once the target has been reached */
	done: Accessor<boolean>;
	/** Milliseconds remaining, clamped at 0 */
	total: Accessor<number>;
}

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * Countdown to a point in time — recomputes every 250 ms so `done` flips
 * promptly. `target` may be a `Date`, epoch milliseconds, or an accessor
 * returning either; change the accessor to re-target a live countdown.
 *
 * @param target — `Date` or epoch ms (or an accessor returning one)
 * @returns `{ days, hours, minutes, seconds, done, total }` accessors
 *
 * @example
 * const cd = useCountdown(Date.now() + 90_000);
 * <p>{cd.minutes()}:{String(cd.seconds()).padStart(2, "0")}</p>
 */
export function useCountdown(target: MaybeAccessor<Date | number>): CountdownState {
	const now = useNow(250);

	const total = createMemo(() => {
		const t = read(target);
		const ms = (t instanceof Date ? t.getTime() : t) - now().getTime();
		return Math.max(0, ms);
	});
	const days = createMemo(() => Math.floor(total() / 86_400_000));
	const hours = createMemo(() => Math.floor(total() / 3_600_000) % 24);
	const minutes = createMemo(() => Math.floor(total() / 60_000) % 60);
	const seconds = createMemo(() => Math.floor(total() / 1_000) % 60);
	const done = createMemo(() => total() === 0);

	return { days, hours, minutes, seconds, done, total };
}
