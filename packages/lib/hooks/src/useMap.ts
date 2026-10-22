import { type Accessor, createSignal } from "solid-js";

export interface MapControls<K, V> {
	/** Reactive lookup — re-reads the current map */
	get: (key: K) => V | undefined;
	/** Insert or overwrite an entry */
	set: (key: K, value: V) => void;
	/** Reactive membership check */
	has: (key: K) => boolean;
	/** Remove an entry — returns whether it existed */
	delete: (key: K) => boolean;
	/** Remove all entries */
	clear: () => void;
	/** Reactive entry count */
	size: Accessor<number>;
	/** Reactive snapshot of `[key, value]` pairs in insertion order */
	entries: () => [K, V][];
}

/**
 * Reactive `Map` wrapper — every mutation replaces the underlying map so all
 * derived accessors (`get`, `has`, `size`, `entries`) stay in sync.
 *
 * @param initial — Seed entries. @default empty
 * @returns `{ get, set, has, delete, clear, size, entries }`
 *
 * @example
 * const cart = useMap<string, number>([["apple", 2]]);
 * cart.set("mango", 1);
 * <p>{cart.size()} items — apples: {cart.get("apple")}</p>
 */
export function useMap<K, V>(initial?: Iterable<readonly [K, V]>): MapControls<K, V> {
	const [map, setMap] = createSignal(new Map<K, V>(initial));
	const mutate = (fn: (draft: Map<K, V>) => void) => {
		setMap((prev) => {
			const draft = new Map(prev);
			fn(draft);
			return draft;
		});
	};
	return {
		get: (key) => map().get(key),
		set: (key, value) => mutate((m) => void m.set(key, value)),
		has: (key) => map().has(key),
		delete: (key) => {
			let existed = false;
			mutate((m) => {
				existed = m.delete(key);
			});
			return existed;
		},
		clear: () => mutate((m) => m.clear()),
		size: () => map().size,
		entries: () => [...map().entries()],
	};
}
