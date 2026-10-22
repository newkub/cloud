import { type Accessor, createSignal } from "solid-js";

export interface SetControls<T> {
	/** Reactive membership check */
	has: (value: T) => boolean;
	/** Add a value (no-op when already present) */
	add: (value: T) => void;
	/** Remove a value — returns whether it existed */
	delete: (value: T) => boolean;
	/** Add when absent, remove when present — returns the new membership */
	toggle: (value: T) => boolean;
	/** Remove all values */
	clear: () => void;
	/** Reactive value count */
	size: Accessor<number>;
}

/**
 * Reactive `Set` wrapper — mutations replace the underlying set so `has` and
 * `size` stay reactive.
 *
 * @param initial — Seed values. @default empty
 * @returns `{ has, add, delete, toggle, clear, size }`
 *
 * @example
 * const tags = useSet<string>(["solid"]);
 * <button onClick={() => tags.toggle("ui")}>{tags.has("ui") ? "on" : "off"}</button>
 */
export function useSet<T>(initial?: Iterable<T>): SetControls<T> {
	const [set, setSet] = createSignal(new Set<T>(initial));
	const mutate = (fn: (draft: Set<T>) => void) => {
		setSet((prev) => {
			const draft = new Set(prev);
			fn(draft);
			return draft;
		});
	};
	return {
		has: (value) => set().has(value),
		add: (value) => mutate((s) => void s.add(value)),
		delete: (value) => {
			let existed = false;
			mutate((s) => {
				existed = s.delete(value);
			});
			return existed;
		},
		toggle: (value) => {
			const next = !set().has(value);
			mutate((s) => (next ? s.add(value) : s.delete(value)));
			return next;
		},
		clear: () => mutate((s) => s.clear()),
		size: () => set().size,
	};
}
