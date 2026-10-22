import { type Accessor, createSignal } from "solid-js";

export interface StackControls<T> {
	/** Reactive snapshot — bottom of the stack first, top last */
	items: Accessor<T[]>;
	/** Push values onto the top — returns false when `capacity` is reached */
	push: (...values: T[]) => boolean;
	/** Remove and return the top value — undefined when empty */
	pop: () => T | undefined;
	/** Read the top value without removing it */
	peek: () => T | undefined;
	/** Reactive count */
	size: Accessor<number>;
	/** Remove all values */
	clear: () => void;
}

/**
 * Last-in-first-out stack backed by a signal — the last element of `items()`
 * is the top. Optional `capacity` rejects pushes once the stack is full.
 *
 * @param initial — Seed values, bottom first. @default empty
 * @param options — `capacity` caps the stack size
 * @returns `{ items, push, pop, peek, size, clear }`
 *
 * @example
 * const nav = useStack<Route>(["/"], { capacity: 50 });
 * nav.push("/settings");
 * <button onClick={nav.pop} disabled={!nav.size()}>back</button>
 */
export function useStack<T>(
	initial?: Iterable<T>,
	options?: {
		/** Maximum number of items — pushes beyond it are ignored. */
		capacity?: number;
	},
): StackControls<T> {
	const [items, setItems] = createSignal<T[]>([...(initial ?? [])]);
	return {
		items,
		push: (...values) => {
			const cap = options?.capacity;
			if (cap !== undefined && items().length + values.length > cap) return false;
			setItems((s) => [...s, ...values]);
			return true;
		},
		pop: () => {
			const s = items();
			if (s.length === 0) return undefined;
			setItems(s.slice(0, -1));
			return s[s.length - 1];
		},
		peek: () => items()[items().length - 1],
		size: () => items().length,
		clear: () => setItems([]),
	};
}
