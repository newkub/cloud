import type { Accessor } from "solid-js";

/**
 * Always-current accessor over a value or another accessor — when given
 * an accessor it delegates to it, when given a plain value it wraps it
 * in a getter. Lets callbacks and effects read the latest input through
 * a uniform `Accessor<T>` interface. Plain function values are treated
 * as accessors — wrap real function values in a getter.
 *
 * @param input — Plain value or accessor to read through
 * @returns Accessor yielding the latest input
 *
 * @example
 * const cb = useLatest(() => props.onSave);
 * // inside a stable listener: always calls the newest onSave
 * el.addEventListener("save", () => cb()());
 */
export function useLatest<T>(input: T | Accessor<T>): Accessor<T> {
	return typeof input === "function" ? (input as Accessor<T>) : () => input;
}
