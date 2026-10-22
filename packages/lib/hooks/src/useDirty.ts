import { type Accessor, createMemo, createSignal } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface DirtyControls {
	/** True when `value` differs from the current baseline (`!==`). */
	dirty: Accessor<boolean>;
	/** Adopt the current value as the new baseline — `dirty()` becomes false. */
	markClean: () => void;
	/** Restore the baseline captured at creation (or the original `baseline` argument). */
	reset: () => void;
}

/**
 * Dirty tracking against a baseline — `dirty()` compares the live `value`
 * accessor to the baseline captured at creation. `markClean` rebaselines to
 * the current value (e.g. after a save); `reset` restores the original
 * baseline.
 *
 * @param value — Accessor holding the tracked value
 * @param baseline — Value or accessor to compare against. @default value() at creation
 * @returns `{ dirty, markClean, reset }`
 *
 * @example
 * const [name, setName] = createSignal("Ada");
 * const d = useDirty(name);
 * <Show when={d.dirty()}><button onClick={d.markClean}>mark saved</button></Show>
 */
export function useDirty<T>(value: Accessor<T>, baseline?: MaybeAccessor<T>): DirtyControls {
	const initial = baseline === undefined ? value() : read(baseline);
	const [base, setBase] = createSignal<T>(initial);
	const dirty = createMemo(() => value() !== base());

	const markClean = () => setBase(() => value());
	const reset = () => setBase(() => initial);

	return { dirty, markClean, reset };
}
