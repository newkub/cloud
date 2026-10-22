import { type Accessor, createMemo } from "solid-js";

/** Key selector for {@link useFuse} — plain property name or `{ name, weight }`. */
export interface FuseOptionKey<T> {
	/** Property to match against. */
	name: keyof T;
	/** Relative influence of this key (`> 0`). @default 1 */
	weight?: number;
}

/** Options for {@link useFuse}. */
export interface FuseOptions<T> {
	/** Keys to search; all primitive values when omitted. */
	keys?: (keyof T | FuseOptionKey<T>)[];
	/** Fuse.js-style tolerance, `0` strict to `1` lenient. An item is kept when its normalized score ≥ `1 - threshold`. @default 0.6 */
	threshold?: number;
	/** Accepted for API compatibility — the matcher already scans the whole value. @default true */
	ignoreLocation?: boolean;
	/** Include the `score` on each result. @default true */
	includeScore?: boolean;
}

/** One ranked hit from {@link useFuse}. */
export interface FuseResult<T> {
	item: T;
	/** Normalized relevance, higher is better, `0..1` (only when `includeScore`). */
	score?: number;
}

const BOUNDARY = /[\s_./-]/;

function isBoundary(text: string, i: number): boolean {
	if (i === 0) return true;
	const prev = text[i - 1] as string;
	if (BOUNDARY.test(prev)) return true;
	return /[a-z0-9]/.test(prev) && /[A-Z]/.test(text[i] as string);
}

/** Subsequence score normalized to `0..1` (0 = no match, 1 = exact). */
function score(value: string, query: string): number {
	const text = value.toLowerCase();
	const q = query.toLowerCase();
	if (!q) return 1;
	if (text === q) return 1;
	let raw = 0;
	let pos = 0;
	let last = -1;
	for (let i = 0; i < q.length; i++) {
		const found = text.indexOf(q[i] as string, pos);
		if (found === -1) return 0;
		raw += 8;
		if (found === 0) raw += 30;
		else if (isBoundary(value, found)) raw += 20;
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

function entriesOf<T>(item: T, keys?: FuseOptions<T>["keys"]): { value: string; weight: number }[] {
	if (item !== null && typeof item === "object") {
		const record = item as Record<string, unknown>;
		if (keys?.length) {
			return keys.map((k) => {
				const key = typeof k === "object" && k !== null && "name" in k ? (k as FuseOptionKey<T>) : undefined;
				const name = String((key ? key.name : k) as string);
				return { value: String(record[name] ?? ""), weight: Math.max(0.01, key?.weight ?? 1) };
			});
		}
		return Object.values(record)
			.filter((v) => v !== null && v !== undefined && typeof v !== "object")
			.map((v) => ({ value: String(v), weight: 1 }));
	}
	return item === null || item === undefined ? [] : [{ value: String(item), weight: 1 }];
}

/**
 * Lightweight fuse.js-style ranker over string keys without the fuse.js
 * dependency — reuses the deterministic subsequence scoring (exact → prefix →
 * word-start → subsequence), weights keys, and filters with a fuse-like
 * `threshold` on the normalized score. Higher score means a better match.
 *
 * @param list — Static array or accessor to rank
 * @param query — Reactive search string; empty query returns everything
 * @param options — `keys`, `threshold`, `ignoreLocation`, `includeScore`
 * @returns `{ results }` — accessor of ranked hits
 *
 * @example
 * const { results } = useFuse(fruits, term, { keys: ["name", { name: "kind", weight: 0.5 }] });
 * <For each={results()}>{({ item }) => <li>{item.name}</li>}</For>
 */
export function useFuse<T>(
	list: T[] | Accessor<T[]>,
	query: Accessor<string>,
	options?: FuseOptions<T>,
): {
	results: Accessor<FuseResult<T>[]>;
} {
	const source = typeof list === "function" ? (list as Accessor<T[]>) : () => list;
	const threshold = options?.threshold ?? 0.6;
	const includeScore = options?.includeScore !== false;

	const results = createMemo<FuseResult<T>[]>(() => {
		const q = query();
		const items = source();
		if (!q) return items.map((item) => (includeScore ? { item, score: 1 } : { item }));
		const min = 1 - threshold;
		const hits: { item: T; order: number; score: number }[] = [];
		items.forEach((item, order) => {
			let sum = 0;
			let total = 0;
			for (const { value, weight } of entriesOf(item, options?.keys)) {
				sum += score(value, q) * weight;
				total += weight;
			}
			const s = total > 0 ? sum / total : 0;
			if (s >= min && s > 0) hits.push({ item, order, score: s });
		});
		hits.sort((a, b) => b.score - a.score || a.order - b.order);
		return hits.map((h) => (includeScore ? { item: h.item, score: h.score } : { item: h.item }));
	});

	return { results };
}
