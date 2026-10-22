import { type Accessor, createEffect, createRoot, on, onCleanup } from "solid-js";

/** Options for {@link useWatch}. */
export interface WatchOptions {
	/**
	 * Invoke the callback once immediately with the current value
	 * (`previous` is `undefined`). @default false
	 */
	immediate?: boolean;
}

/**
 * Watch an accessor and run a callback on each change — like a
 * Vue-style `watch`. Skips the initial run unless `immediate` is set.
 * Returns a `stop()` function that detaches the watcher early; the
 * watcher is also disposed automatically with the owning scope.
 *
 * @param source — Accessor to observe
 * @param callback — Invoked as `(value, previous)` on every change
 * @param options — `immediate` fires the callback once with the current value
 * @returns `stop()` — stops invoking the callback
 *
 * @example
 * const stop = useWatch(query, (q, prev) => search(q));
 * stop(); // detach early — also auto-stops on cleanup
 */
export function useWatch<T>(
	source: Accessor<T>,
	callback: (value: T, previous: T | undefined) => void,
	options?: WatchOptions,
): () => void {
	const stop = createRoot((dispose) => {
		createEffect(on(source, (value, previous) => callback(value, previous), { defer: !options?.immediate }));
		return dispose;
	});
	onCleanup(stop);
	return stop;
}
