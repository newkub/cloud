import { type Accessor, createEffect, createSignal } from "solid-js";

export interface UntilControls<T> {
	/** True once the predicate has matched */
	done: Accessor<boolean>;
	/** The source value captured at the moment of the match */
	value: Accessor<T | undefined>;
	/** Stop watching without a match */
	stop: () => void;
}

/**
 * Waits until a signal/accessor satisfies a predicate and reports the matched
 * value. Works synchronously on the current value and reactively on later
 * changes; async predicates resolve via a microtask. After the first match the
 * watcher keeps re-running but does nothing (guarded by `done`).
 *
 * @param source — Accessor to watch
 * @param predicate — Sync or async test; receives the latest value
 * @returns `{ done, value, stop }`
 *
 * @example
 * const [count] = createSignal(0);
 * const reached10 = useUntil(count, (n) => n >= 10);
 * <Show when={reached10.done()}>reached {reached10.value()}</Show>
 */
export function useUntil<T>(
	source: Accessor<T>,
	predicate: (value: T) => boolean | Promise<boolean>,
): UntilControls<T> {
	const [done, setDone] = createSignal(false);
	const [value, setValue] = createSignal<T | undefined>(undefined);
	let stopped = false;

	createEffect(() => {
		const current = source();
		if (stopped || done()) return;
		const result = predicate(current);
		if (typeof result === "boolean") {
			if (result) {
				setValue(() => current);
				setDone(true);
			}
			return;
		}
		void result.then((ok) => {
			if (!stopped && !done() && ok) {
				setValue(() => current);
				setDone(true);
			}
		});
	});

	return { done, value, stop: () => (stopped = true) };
}
