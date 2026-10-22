import { type Accessor, createEffect, createSignal } from "solid-js";

export interface StateHistoryEntry<T> {
	/** Recorded value. */
	value: T;
	/** `Date.now()` timestamp of when the change was recorded. */
	ts: number;
}

export interface StateHistoryOptions {
	/** Maximum entries kept — oldest are dropped first. */
	limit?: number;
}

export interface StateHistoryControls<T> {
	/** Recorded entries, oldest first — empty until the first change. */
	history: Accessor<StateHistoryEntry<T>[]>;
	/** Configured cap from `options.limit` (undefined when uncapped). */
	limit: number | undefined;
	/** Drop every recorded entry. */
	clear: () => void;
}

/**
 * Change journal for a signal — every time `source` produces a new value,
 * `{ value, ts: Date.now() }` is appended to `history`. The initial value is
 * not recorded; identical consecutive values are skipped. `limit` caps the
 * log by dropping the oldest entries.
 *
 * @param source — Accessor to observe
 * @param options — `limit` caps how many entries are kept
 * @returns `{ history, limit, clear }`
 *
 * @example
 * const [level, setLevel] = createSignal(50);
 * const h = useStateHistory(level, { limit: 10 });
 * <For each={h.history()}>{(e) => <li>{e.value} @ {new Date(e.ts).toLocaleTimeString()}</li>}</For>
 */
export function useStateHistory<T>(source: Accessor<T>, options?: StateHistoryOptions): StateHistoryControls<T> {
	const [history, setHistory] = createSignal<StateHistoryEntry<T>[]>([]);
	let last = source();
	createEffect(() => {
		const v = source();
		if (v === last) return;
		last = v;
		setHistory((h) => {
			const next = [...h, { value: v, ts: Date.now() }];
			const limit = options?.limit;
			return limit !== undefined && next.length > limit ? next.slice(next.length - limit) : next;
		});
	});
	return { history, limit: options?.limit, clear: () => setHistory([]) };
}
