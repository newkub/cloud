import { type Accessor, createSignal, type Setter } from "solid-js";

/** Result of {@link useResettable}. */
export interface ResettableSignal<T> {
	/** Current value. */
	value: Accessor<T>;
	/** Set a literal value or an updater, same semantics as `createSignal`. */
	set: Setter<T>;
	/** Restore `value` to the captured initial value. */
	reset: () => void;
	/** True while `value` differs from the captured initial value. */
	dirty: Accessor<boolean>;
}

/**
 * Signal that remembers its initial value — `reset()` restores it and
 * `dirty()` reports whether the current value differs.
 *
 * @param initial — Value captured at creation; `reset()` returns to it
 * @returns `{ value, set, reset, dirty }`
 *
 * @example
 * const draft = useResettable({ text: "" });
 * draft.set({ text: "edited" });
 * draft.dirty(); // true
 * draft.reset(); // back to { text: "" }
 */
export function useResettable<T>(initial: T): ResettableSignal<T> {
	const [value, setValue] = createSignal(initial);
	return {
		value,
		set: setValue,
		reset: () => setValue(() => initial),
		dirty: () => value() !== initial,
	};
}
