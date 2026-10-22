import { type Accessor, createSignal } from "solid-js";

/** One scored hit from {@link useFuzzyMatch}. */
export interface FuzzyMatchItem<T> {
	/** The matched list entry. */
	item: T;
	/** Its position in the original list. */
	index: number;
	/** Normalized match score, `0..1` (`1` = exact, empty query = `0`). */
	score: number;
}

/** Options for {@link useFuzzyMatch}. */
export interface FuzzyMatchOptions<T> {
	/** Property names used as match candidates; all primitive values when omitted. */
	keys?: (keyof T)[];
	/** Minimum normalized score to keep a hit (`0..1`). @default 0.33 */
	threshold?: number;
	/** Maximum number of hits returned (best first). */
	limit?: number;
	/** Distinguish upper/lower case. @default false */
	caseSensitive?: boolean;
}

/** Reactive surface returned by {@link useFuzzyMatch}. */
export interface FuzzyMatchState<T> {
	/** Current hits (best first) for the reactive `query()`. */
	results: Accessor<FuzzyMatchItem<T>[]>;
	/** Last query set through `setQuery`. */
	query: Accessor<string>;
	/** Update the query and re-rank `results`. */
	setQuery: (q: string) => void;
	/** Rank the list against an arbitrary query without touching state. */
	search: (q: string) => FuzzyMatchItem<T>[];
}

const BOUNDARY = /[\s_./-]/;

/** Word-start: string start, separator, or camelCase boundary. */
function isBoundary(text: string, i: number): boolean {
	if (i === 0) return true;
	const prev = text[i - 1] as string;
	if (BOUNDARY.test(prev)) return true;
	return /[a-z0-9]/.test(prev) && /[A-Z]/.test(text[i] as string);
}

/** Deterministic subsequence score in `0..1`; `0` when `query` is not a subsequence. */
function scoreText(original: string, query: string, caseSensitive: boolean): number {
	const text = caseSensitive ? original : original.toLowerCase();
	const q = caseSensitive ? query : query.toLowerCase();
	if (!q) return 0;
	if (text === q) return 1;
	let raw = 0;
	let pos = 0;
	let last = -1;
	for (let i = 0; i < q.length; i++) {
		const found = text.indexOf(q[i] as string, pos);
		if (found === -1) return 0;
		raw += 8;
		if (found === 0) raw += 30;
		else if (isBoundary(original, found)) raw += 20;
		if (last !== -1) {
			if (found === last + 1) raw += 15;
			else raw -= (found - last - 1) * 2;
		} else if (found > 0) raw -= found * 2;
		last = found;
		pos = found + 1;
	}
	if (text.startsWith(q)) raw += 25;
	return Math.min(0.99, Math.max(0, raw / (q.length * 45)));
}

function stringsOf<T>(item: T, keys?: (keyof T)[]): string[] {
	if (typeof item === "string") return [item];
	if (item && typeof item === "object") {
		const record = item as Record<string, unknown>;
		const picked = keys?.length ? keys.map((k) => record[k as string]) : Object.values(record);
		return picked.filter((v) => v !== null && v !== undefined && typeof v !== "object").map(String);
	}
	return item === null || item === undefined ? [] : [String(item)];
}

/**
 * Subsequence fuzzy matcher (VueUse style) over a list — scores exact matches
 * highest, then prefixes and word-start hits (space/`_`/`-`/camelCase
 * boundaries), weighting consecutive characters and penalizing gaps. Empty
 * query keeps the full list at score `0`.
 *
 * @param list — Static array or accessor to rank
 * @param options — `keys`, `threshold` (min `0..1` score), `limit`, `caseSensitive`
 * @returns `{ results, query, setQuery, search }`
 *
 * @example
 * const m = useFuzzyMatch(users, { keys: ["name"], threshold: 0.3 });
 * m.setQuery("fb"); // ranks "foo bar" and "FooBar" by score
 * <For each={m.results()}>{(r) => <li>{r.item.name} — {r.score.toFixed(2)}</li>}</For>
 */
export function useFuzzyMatch<T extends Record<string, unknown>>(
	list: T[] | Accessor<T[]>,
	options?: FuzzyMatchOptions<T>,
): FuzzyMatchState<T> {
	const source = typeof list === "function" ? (list as Accessor<T[]>) : () => list;
	const threshold = options?.threshold ?? 0.33;
	const caseSensitive = options?.caseSensitive ?? false;
	const [query, setQuerySignal] = createSignal("");

	const search = (q: string): FuzzyMatchItem<T>[] => {
		const items = source();
		const scored: FuzzyMatchItem<T>[] = items.map((item, index) => {
			let score = 0;
			if (q) for (const s of stringsOf(item, options?.keys)) score = Math.max(score, scoreText(s, q, caseSensitive));
			return { item, index, score };
		});
		const kept = (q ? scored.filter((r) => r.score >= threshold) : scored).sort(
			(a, b) => b.score - a.score || a.index - b.index,
		);
		return options?.limit !== undefined ? kept.slice(0, options.limit) : kept;
	};

	const [results, setResults] = createSignal<FuzzyMatchItem<T>[]>(search(""));
	const setQuery = (q: string) => {
		setQuerySignal(q);
		setResults(search(q));
	};

	return { results, query, setQuery, search };
}
