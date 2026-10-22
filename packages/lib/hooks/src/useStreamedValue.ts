import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface StreamedValueControls<T> {
	/** Latest yielded value. */
	value: Accessor<T | undefined>;
	/** True once the iterable completes. */
	done: Accessor<boolean>;
	/** Iteration error, if any. */
	error: Accessor<unknown>;
	/** Stop consuming. */
	cancel: () => void;
	/** All values seen so far. */
	history: Accessor<T[]>;
}

/**
 * Consume an `AsyncIterable` reactively — each yielded chunk lands on
 * `value()`; `history()` accumulates all chunks.
 *
 * @param iterable - AsyncIterable or accessor returning one
 * @returns `{ value, done, error, cancel, history }`
 *
 * @example
 * const s = useStreamedValue(asyncIterableOfChunks);
 * <Show when={!s.done()}>…{s.value()}</Show>
 */
export function useStreamedValue<T>(iterable: AsyncIterable<T> | (() => AsyncIterable<T>)): StreamedValueControls<T> {
	const [value, setValue] = createSignal<T | undefined>(undefined);
	const [done, setDone] = createSignal(false);
	const [error, setError] = createSignal<unknown>(undefined);
	const [history, setHistory] = createSignal<T[]>([]);

	let cancelled = false;
	let iterator: AsyncIterator<T> | undefined;

	const cancel = () => {
		cancelled = true;
		void iterator?.return?.();
	};

	(async () => {
		try {
			const src = typeof iterable === "function" ? iterable() : iterable;
			iterator = src[Symbol.asyncIterator]();
			for (;;) {
				const next = await iterator.next();
				if (cancelled) return;
				if (next.done) {
					setDone(true);
					return;
				}
				setValue(() => next.value);
				setHistory((h) => [...h, next.value]);
			}
		} catch (e) {
			if (!cancelled) setError(e);
		}
	})();

	onCleanup(cancel);
	return { value, done, error, cancel, history };
}
