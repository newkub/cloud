import { type Accessor, createSignal } from "solid-js";

export interface ListControls<T> {
	/** Reactive snapshot of the list */
	items: Accessor<T[]>;
	/** Append values to the end */
	push: (...values: T[]) => void;
	/** Remove the value at `index` — returns it, or undefined when out of range */
	remove: (index: number) => T | undefined;
	/** Insert a value at `index` (clamped to `[0, length]`) */
	insert: (index: number, value: T) => void;
	/** Replace the value at `index` — accepts a value or an updater */
	update: (index: number, value: T | ((prev: T) => T)) => void;
	/** Move the value at `from` to `to` */
	move: (from: number, to: number) => void;
	/** Keep only values matching `predicate` — returns the removed values */
	filter: (predicate: (value: T, index: number) => boolean) => T[];
	/** Replace the whole list */
	set: (values: Iterable<T>) => void;
	/** Remove all values */
	clear: () => void;
}

/**
 * Reactive array helpers — `items()` re-reads on every mutation.
 *
 * @param initial — Seed values. @default empty
 * @returns `{ items, push, remove, insert, update, move, filter, set, clear }`
 *
 * @example
 * const todos = useList<string>(["ship"]);
 * todos.push("test");
 * <For each={todos.items()}>{(t, i) => <li onClick={() => todos.remove(i())}>{t}</li>}</For>
 */
export function useList<T>(initial?: Iterable<T>): ListControls<T> {
	const [items, setItems] = createSignal<T[]>([...(initial ?? [])]);
	return {
		items,
		push: (...values) => setItems((l) => [...l, ...values]),
		remove: (index) => {
			const l = items();
			if (index < 0 || index >= l.length) return undefined;
			setItems([...l.slice(0, index), ...l.slice(index + 1)]);
			return l[index];
		},
		insert: (index, value) =>
			setItems((l) => {
				const i = Math.max(0, Math.min(index, l.length));
				return [...l.slice(0, i), value, ...l.slice(i)];
			}),
		update: (index, value) =>
			setItems((l) =>
				index < 0 || index >= l.length
					? l
					: l.map((prev, i) =>
							i === index ? (typeof value === "function" ? (value as (p: T) => T)(prev) : value) : prev,
						),
			),
		move: (from, to) =>
			setItems((l) => {
				if (from < 0 || from >= l.length) return l;
				const i = Math.max(0, Math.min(to, l.length - 1));
				const next = [...l];
				const [value] = next.splice(from, 1);
				if (value !== undefined) next.splice(i, 0, value);
				return next;
			}),
		filter: (predicate) => {
			const removed = items().filter((v, i) => !predicate(v, i));
			setItems((l) => l.filter(predicate));
			return removed;
		},
		set: (values) => setItems([...values]),
		clear: () => setItems([]),
	};
}
