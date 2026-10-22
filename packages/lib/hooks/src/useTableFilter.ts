import { type Accessor, createMemo, createSignal } from "solid-js";

export interface TableFilterOptions<T> {
	/** Keys searched by the free-text `query` — defaults to every key of the first row */
	keys?: (keyof T)[];
}

export interface TableFilterControls<T> {
	/** Rows matching the query AND every active filter */
	rows: Accessor<T[]>;
	/** Free-text query */
	query: Accessor<string>;
	/** Update the text query */
	setQuery: (query: string) => void;
	/** Active per-key filters — empty values are treated as unset */
	filters: Accessor<Record<string, string>>;
	/** Set a per-key filter — `undefined`/`""` clears that key */
	setFilter: (key: string, value: string | undefined) => void;
	/** Clear the query and all filters */
	clear: () => void;
}

const cell = (row: unknown, key: string) => String((row as Record<string, unknown>)[key] ?? "").toLowerCase();

/**
 * Text query + per-key filters over table rows — `query` is a case-insensitive
 * substring match across `keys` (all keys by default); each entry in `filters`
 * is a case-insensitive substring match on that column. `rows` re-derives
 * reactively; `clear()` resets everything.
 *
 * @param data — Rows, static array or reactive accessor
 * @param options — `keys` searched by the free-text query
 * @returns `{ rows, query, setQuery, filters, setFilter, clear }`
 *
 * @example
 * const t = useTableFilter(users, { keys: ["name", "email"] });
 * <input onInput={(e) => t.setQuery(e.currentTarget.value)} />
 * <select onChange={(e) => t.setFilter("role", e.currentTarget.value || undefined)} />
 * <For each={t.rows()}>{(u) => <Row user={u} />}</For>
 */
export function useTableFilter<T>(data: T[] | Accessor<T[]>, options?: TableFilterOptions<T>): TableFilterControls<T> {
	const list = () => (typeof data === "function" ? (data as Accessor<T[]>)() : data);
	const [query, setQuery] = createSignal("");
	const [filters, setFilters] = createSignal<Record<string, string>>({});

	const rows = createMemo(() => {
		const q = query().trim().toLowerCase();
		const active = Object.entries(filters()).filter(([, v]) => v !== "");
		const keys = options?.keys?.map(String) ?? Object.keys((list()[0] ?? {}) as Record<string, unknown>);
		return list().filter((row) => {
			if (q && !keys.some((k) => cell(row, k).includes(q))) return false;
			return active.every(([k, v]) => cell(row, k).includes(v.toLowerCase()));
		});
	});

	return {
		rows,
		query,
		setQuery,
		filters,
		setFilter: (key, value) =>
			setFilters((f) => {
				const next = { ...f };
				if (value === undefined || value === "") delete next[key];
				else next[key] = value;
				return next;
			}),
		clear: () => {
			setQuery("");
			setFilters({});
		},
	};
}
