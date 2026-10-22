import { type Accessor, createSignal, onCleanup } from "solid-js";

/**
 * Bridge an external store into the reactive graph — the Solid equivalent of
 * React's `useSyncExternalStore`. `getSnapshot` must be cached/stable (return
 * the same value until the store changes) to avoid re-render loops.
 *
 * @param subscribe - `(onChange) => unsubscribe`
 * @param getSnapshot - returns the current store value
 * @returns `Accessor<T>` tracking the external store
 *
 * @example
 * const width = useSyncExternal(
 *   (cb) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); },
 *   () => window.innerWidth,
 * );
 */
export function useSyncExternal<T>(subscribe: (onChange: () => void) => () => void, getSnapshot: () => T): Accessor<T> {
	const [value, setValue] = createSignal<T>(getSnapshot(), { equals: false });
	const sync = () => setValue(() => getSnapshot());
	const unsubscribe = subscribe(sync);
	sync(); // pick up any change between first snapshot and subscribe
	onCleanup(unsubscribe);
	return value;
}
