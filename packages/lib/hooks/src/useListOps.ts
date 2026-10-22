import { type Accessor, createSignal } from "solid-js";

export interface ListOpsControls<T> {
	/** Reactive snapshot of the list */
	items: Accessor<T[]>;
	/** Append values to the end */
	push: (...values: T[]) => void;
	/** Remove and return the last value — undefined when empty */
	pop: () => T | undefined;
	/** Remove and return the first value — undefined when empty */
	shift: () => T | undefined;
	/** Prepend values to the front */
	unshift: (...values: T[]) => void;
	/** Insert a value at `index` (clamped to `[0, length]`) */
	insert: (index: number, value: T) => void;
	/** Remove and return the value at `index` — undefined when out of range */
	removeAt: (index: number) => T | undefined;
	/** Move the value at `from` to `to` (both clamped to the list) */
	move: (from: number, to: number) => void;
	/** Swap the values at `a` and `b` — no-op when either is out of range */
	swap: (a: number, b: number) => void;
	/** Replace the value at `index` — accepts a value or an updater */
	update: (index: number, value: T | ((prev: T) => T)) => void;
	/** Replace the whole list */
	set: (values: Iterable<T>) => void;
	/** Remove all values */
	clear: () => void;
	/** Current number of items */
	length: Accessor<number>;
}

/**
 * Full-stack list operations — stack (`push`/`pop`), queue (`shift`/`unshift`),
 * and positional edits (`insert`/`removeAt`/`move`/`swap`/`update`) over one
 * reactive array. `items()` re-reads on every mutation; `length` is a memo.
 *
 * @param initial — Seed values. @default empty
 * @returns `{ items, push, pop, shift, unshift, insert, removeAt, move, swap, update, set, clear, length }`
 *
 * @example
 * const chips = useListOps<string>(["alpha", "beta"]);
 * chips.push("gamma");
 * chips.move(2, 0);
 * <For each={chips.items()}>{(c) => <span>{c}</span>}</For>
 */
export function useListOps<T>(initial?: Iterable<T>): ListOpsControls<T> {
	const [items, setItems] = createSignal<T[]>([...(initial ?? [])]);
	const length = () => items().length;
	return {
		items,
		push: (...values) => setItems((l) => [...l, ...values]),
		pop: () => {
			const l = items();
			if (l.length === 0) return undefined;
			setItems(l.slice(0, -1));
			return l[l.length - 1];
		},
		shift: () => {
			const l = items();
			if (l.length === 0) return undefined;
			setItems(l.slice(1));
			return l[0];
		},
		unshift: (...values) => setItems((l) => [...values, ...l]),
		insert: (index, value) =>
			setItems((l) => {
				const i = Math.max(0, Math.min(index, l.length));
				return [...l.slice(0, i), value, ...l.slice(i)];
			}),
		removeAt: (index) => {
			const l = items();
			if (index < 0 || index >= l.length) return undefined;
			setItems([...l.slice(0, index), ...l.slice(index + 1)]);
			return l[index];
		},
		move: (from, to) =>
			setItems((l) => {
				if (from < 0 || from >= l.length) return l;
				const i = Math.max(0, Math.min(to, l.length - 1));
				const next = [...l];
				const [value] = next.splice(from, 1);
				if (value !== undefined) next.splice(i, 0, value);
				return next;
			}),
		swap: (a, b) =>
			setItems((l) => {
				if (a < 0 || a >= l.length || b < 0 || b >= l.length || a === b) return l;
				const next = [...l];
				const va = next[a];
				const vb = next[b];
				if (va === undefined || vb === undefined) return l;
				next[a] = vb;
				next[b] = va;
				return next;
			}),
		update: (index, value) =>
			setItems((l) =>
				index < 0 || index >= l.length
					? l
					: l.map((prev, i) =>
							i === index ? (typeof value === "function" ? (value as (p: T) => T)(prev) : value) : prev,
						),
			),
		set: (values) => setItems([...values]),
		clear: () => setItems([]),
		length,
	};
}
