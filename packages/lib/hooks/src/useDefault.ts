import { type Accessor, createMemo } from "solid-js";

/**
 * Nullish-coalescing accessor — returns `source()` when it's neither
 * `undefined` nor `null`, `fallback` otherwise. Handy for optional props
 * with a default display value.
 *
 * @param source — Accessor that may resolve to `undefined`/`null`
 * @param fallback — Value used when `source()` is nullish
 * @returns Accessor that never resolves to `undefined`/`null`
 *
 * @example
 * const label = useDefault(() => props.title, "untitled");
 * <h1>{label()}</h1>
 */
export function useDefault<T>(source: Accessor<T | undefined | null>, fallback: T): Accessor<T> {
	return createMemo(() => source() ?? fallback);
}
