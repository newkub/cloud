import { type Accessor, createMemo, createSignal } from "solid-js";

export interface ComboboxFilterControls<T> {
	/** Current query text */
	query: Accessor<string>;
	/** Update the query — resets `activeIndex` to 0 */
	setQuery: (query: string) => void;
	/** Items matching the current query */
	filtered: Accessor<T[]>;
	/** Highlighted index within `filtered` — clamped to the list */
	activeIndex: Accessor<number>;
	/** Set the highlighted index — clamped to `0 .. filtered.length - 1` */
	setActiveIndex: (index: number) => void;
	/** Move the highlight by `dir` steps — wraps around both ends */
	move: (dir: number) => void;
}

/**
 * Combobox query + highlight state — `filtered` re-derives from `items` and
 * `query`, `activeIndex` stays clamped as the list shrinks, `move` wraps for
 * arrow-key navigation.
 *
 * @param items — Candidate list, static or reactive accessor
 * @param options — `filter(item, query)` predicate. @default case-insensitive substring on `String(item)`
 * @returns `{ query, setQuery, filtered, activeIndex, setActiveIndex, move }`
 *
 * @example
 * const box = useComboboxFilter(fruits);
 * <input value={box.query()} onInput={(e) => box.setQuery(e.currentTarget.value)}
 *   onKeyDown={(e) => e.key === "ArrowDown" ? box.move(1) : e.key === "ArrowUp" && box.move(-1)} />
 * <For each={box.filtered()}>{(f, i) => <li class={i() === box.activeIndex() ? "on" : ""}>{f}</li>}</For>
 */
export function useComboboxFilter<T>(
	items: T[] | Accessor<T[]>,
	options?: {
		/** Custom predicate — return true to keep the item. */
		filter?: (item: T, query: string) => boolean;
	},
): ComboboxFilterControls<T> {
	const list = () => (typeof items === "function" ? (items as Accessor<T[]>)() : items);
	const [query, setQueryRaw] = createSignal("");
	const [active, setActiveRaw] = createSignal(0);

	const filtered = createMemo(() => {
		const q = query();
		const filter = options?.filter;
		return list().filter((item) => (filter ? filter(item, q) : String(item).toLowerCase().includes(q.toLowerCase())));
	});

	const clamp = (n: number) => {
		const len = filtered().length;
		return len === 0 ? 0 : Math.min(Math.max(0, n), len - 1);
	};

	return {
		query,
		setQuery: (q) => {
			setQueryRaw(q);
			setActiveRaw(0);
		},
		filtered,
		activeIndex: createMemo(() => clamp(active())),
		setActiveIndex: (index) => setActiveRaw(clamp(index)),
		move: (dir) => {
			const len = filtered().length;
			if (len === 0) return;
			setActiveRaw((((active() + dir) % len) + len) % len);
		},
	};
}
