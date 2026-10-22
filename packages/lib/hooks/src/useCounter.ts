import { type Accessor, createSignal } from "solid-js";

export interface CounterControls {
	/** Current count, always within `[min, max]` when bounds are set */
	count: Accessor<number>;
	/** Add `step × by` (clamped). @param by — Multiplier. @default 1 */
	inc: (by?: number) => void;
	/** Subtract `step × by` (clamped). @param by — Multiplier. @default 1 */
	dec: (by?: number) => void;
	/** Set explicitly — value or updater, always clamped */
	set: (value: number | ((count: number) => number)) => void;
	/** Return to the initial value */
	reset: () => void;
	/** True while the count sits on a configured `min` or `max` bound */
	clamped: Accessor<boolean>;
}

/**
 * Bounded counter — `inc`/`dec` move by `step`, every write is clamped to
 * `[min, max]`.
 *
 * @param initial — Starting value. @default 0
 * @param options — `min`/`max` bounds and `step` size. @default step 1
 * @returns `{ count, inc, dec, set, reset, clamped }`
 *
 * @example
 * const qty = useCounter(1, { min: 0, max: 9 });
 * <button onClick={() => qty.dec()} disabled={qty.clamped() && qty.count() === 0}>−</button>
 * <span>{qty.count()}</span>
 * <button onClick={() => qty.inc()}>+</button>
 */
export function useCounter(
	initial = 0,
	options?: {
		/** Lower bound applied to every write. */
		min?: number;
		/** Upper bound applied to every write. */
		max?: number;
		/** Increment step for `inc`/`dec`. @default 1 */
		step?: number;
	},
): CounterControls {
	const clamp = (v: number) =>
		Math.min(options?.max ?? Number.POSITIVE_INFINITY, Math.max(options?.min ?? Number.NEGATIVE_INFINITY, v));
	const [count, setCount] = createSignal(clamp(initial));
	const set = (value: number | ((count: number) => number)) =>
		setCount((c) => clamp(typeof value === "function" ? value(c) : value));
	return {
		count,
		inc: (by = 1) => set((c) => c + (options?.step ?? 1) * by),
		dec: (by = 1) => set((c) => c - (options?.step ?? 1) * by),
		set,
		reset: () => setCount(clamp(initial)),
		clamped: () => count() === options?.min || count() === options?.max,
	};
}
