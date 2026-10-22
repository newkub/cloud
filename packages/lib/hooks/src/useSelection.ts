import { type Accessor, createSignal } from "solid-js";

export interface SelectionControls<T> {
	/** Reactive snapshot of the selected values */
	selected: Accessor<Set<T>>;
	/** Add when absent, remove when present — in single mode, selects only `value` */
	toggle: (value: T) => void;
	/** Add `value` — replaces the whole selection when `multi` is false */
	select: (value: T) => void;
	/** Remove `value` when present */
	deselect: (value: T) => void;
	/** Select every given value — selects only the first when `multi` is false */
	selectAll: (values: Iterable<T>) => void;
	/** Remove all selected values */
	clear: () => void;
	/** Reactive membership check */
	isSelected: (value: T) => boolean;
	/** Reactive selected count */
	count: Accessor<number>;
}

/**
 * Reactive selection set — every mutation replaces the underlying `Set` so
 * `selected`, `isSelected` and `count` stay in sync. With `multi: false`
 * `select`/`toggle`/`selectAll` keep at most one value.
 *
 * @param options — `multi` toggles multi-select (default true), `initial` seeds values
 * @returns `{ selected, toggle, select, deselect, selectAll, clear, isSelected, count }`
 *
 * @example
 * const sel = useSelection<string>();
 * <For each={tags}>
 *   {(t) => <button onClick={() => sel.toggle(t)}>{sel.isSelected(t) ? "✓" : ""}{t}</button>}
 * </For>
 */
export function useSelection<T>(options?: {
	/** Allow multiple selected values. @default true */
	multi?: boolean;
	/** Initially selected values. @default empty */
	initial?: Iterable<T>;
}): SelectionControls<T> {
	const multi = () => options?.multi !== false;
	const [selected, setSelected] = createSignal(new Set<T>(options?.initial));
	const mutate = (fn: (draft: Set<T>) => void) => {
		setSelected((prev) => {
			const draft = new Set(prev);
			fn(draft);
			return draft;
		});
	};
	return {
		selected,
		toggle: (value) =>
			mutate((s) => {
				if (s.has(value)) {
					s.delete(value);
				} else {
					if (!multi()) s.clear();
					s.add(value);
				}
			}),
		select: (value) =>
			mutate((s) => {
				if (!multi()) s.clear();
				s.add(value);
			}),
		deselect: (value) => mutate((s) => void s.delete(value)),
		selectAll: (values) =>
			mutate((s) => {
				if (multi()) {
					for (const v of values) s.add(v);
				} else {
					const first = values[Symbol.iterator]().next();
					if (!first.done) {
						s.clear();
						s.add(first.value);
					}
				}
			}),
		clear: () => mutate((s) => s.clear()),
		isSelected: (value) => selected().has(value),
		count: () => selected().size,
	};
}
