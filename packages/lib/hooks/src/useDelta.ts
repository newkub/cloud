import { type Accessor, createMemo, createSignal } from "solid-js";

/** Result of {@link useDelta}. */
export interface DeltaValue<T, D> {
	/** Current value — mirrors the source. */
	value: Accessor<T>;
	/** Value before the current one — `undefined` until the first change. */
	previous: Accessor<T | undefined>;
	/** Difference between current and previous — `undefined` until the first change. */
	delta: Accessor<D | undefined>;
}

/**
 * Tracks the difference between successive values of a source — for
 * numeric sources `delta` is `next − previous`, or supply a custom
 * `diff` function for any type. `previous` and `delta` stay
 * `undefined` until the first change, and hold while the source
 * re-emits an equal value.
 *
 * @param source — Accessor to track
 * @param diff — Custom `(next, previous) => delta`; defaults to numeric subtraction
 * @returns `{ value, previous, delta }`
 *
 * @example
 * const pos = useDelta(scrollTop);
 * pos.delta(); // pixels scrolled since last change
 */
export function useDelta<T, D = number>(source: Accessor<T>, diff?: (next: T, previous: T) => D): DeltaValue<T, D> {
	const compute: (next: T, previous: T) => D = diff ?? ((next, previous) => (Number(next) - Number(previous)) as D);
	const [previous, setPrevious] = createSignal<T | undefined>(undefined);
	const [delta, setDelta] = createSignal<D | undefined>(undefined);
	let last: T | undefined;
	let seen = false;
	createMemo(() => {
		const current = source();
		if (!seen) {
			seen = true;
			last = current;
			return;
		}
		if (current !== last) {
			const outgoing = last;
			setPrevious(() => outgoing);
			setDelta(() => compute(current, outgoing as T));
			last = current;
		}
	});
	return { value: source, previous, delta };
}
