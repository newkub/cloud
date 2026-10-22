import { type Accessor, createMemo, createSignal } from "solid-js";

export type TableSortDirection = "asc" | "desc";

export interface TableSortOptions<T> {
	/** Key sorted on mount. */
	initialKey?: string;
	/** Direction applied with `initialKey`. @default "asc" */
	initialDirection?: TableSortDirection;
	/** Per-key comparators — fall back to a numeric/string compare on `row[key]` */
	comparators?: Record<string, (a: T, b: T) => number>;
}

export interface TableSortControls<T> {
	/** Sorted rows — re-derives from `data`, `sortKey`, `direction` */
	rows: Accessor<T[]>;
	/** Active sort key — `undefined` keeps input order */
	sortKey: Accessor<string | undefined>;
	/** Active direction */
	direction: Accessor<TableSortDirection>;
	/** Toggle a key — same key flips direction, a new key sorts ascending */
	toggle: (key: string) => void;
}

const defaultCompare = <T>(a: T, b: T, key: string): number => {
	const av = (a as Record<string, unknown>)[key];
	const bv = (b as Record<string, unknown>)[key];
	if (typeof av === "number" && typeof bv === "number") return av - bv;
	const as = String(av ?? "");
	const bs = String(bv ?? "");
	return as < bs ? -1 : as > bs ? 1 : 0;
};

/**
 * Memo-sorted table rows — `toggle(key)` flips `asc`/`desc` on repeat calls
 * and starts `asc` on a new key. Per-key `comparators` override the default
 * numeric/string compare; `rows` is a memo so sorting is reactive to `data`.
 *
 * @param data — Rows, static array or reactive accessor
 * @param options — `initialKey`/`initialDirection`/`comparators`
 * @returns `{ rows, sortKey, direction, toggle }`
 *
 * @example
 * const table = useTableSort(users, { comparators: { age: (a, b) => a.age - b.age } });
 * <th onClick={() => table.toggle("age")}>Age {table.sortKey() === "age" ? table.direction() : ""}</th>
 * <For each={table.rows()}>{(u) => <Row user={u} />}</For>
 */
export function useTableSort<T>(data: T[] | Accessor<T[]>, options?: TableSortOptions<T>): TableSortControls<T> {
	const list = () => (typeof data === "function" ? (data as Accessor<T[]>)() : data);
	const [sortKey, setSortKey] = createSignal<string | undefined>(options?.initialKey);
	const [direction, setDirection] = createSignal<TableSortDirection>(options?.initialDirection ?? "asc");

	const rows = createMemo(() => {
		const key = sortKey();
		const copy = [...list()];
		if (!key) return copy;
		const cmp = options?.comparators?.[key] ?? ((a: T, b: T) => defaultCompare(a, b, key));
		const dir = direction() === "asc" ? 1 : -1;
		return copy.sort((a, b) => cmp(a, b) * dir);
	});

	return {
		rows,
		sortKey,
		direction,
		toggle: (key) => {
			if (sortKey() === key) {
				setDirection((d) => (d === "asc" ? "desc" : "asc"));
			} else {
				setSortKey(key);
				setDirection("asc");
			}
		},
	};
}
