import { type Accessor, createSignal } from "solid-js";

export interface IncrementalState<T> {
	/** All items loaded so far, in fetch order */
	items: Accessor<T[]>;
	/** Number of items loaded so far */
	loaded: Accessor<number>;
	/** Total item count — `undefined` until a short/empty page proves the end */
	total: Accessor<number | undefined>;
	/** True while a page request is in flight */
	loading: Accessor<boolean>;
	/** Error thrown or rejected by `source` on the last request */
	error: Accessor<unknown>;
	/** Fetch the next page — no-ops while loading or once `done()` */
	next: () => void;
	/** True once the source returned fewer than `limit` items */
	done: Accessor<boolean>;
	/** Clear everything and re-fetch the first page */
	reset: () => void;
}

/**
 * Incrementally load a paged source — `next()` requests the page at the
 * current offset and appends it to `items`. `done` flips true as soon as a
 * page returns fewer than `limit` entries, at which point `total` reports
 * the final count. In-flight `next()` calls are coalesced. Works with sync
 * or async sources; SSR-safe.
 *
 * @param source — `(offset, limit) => items | Promise<items>` page fetcher
 * @param options — `limit` page size; `immediate` auto-loads page one. @default limit 20, immediate true
 * @returns `{ items, loaded, total, loading, error, next, done, reset }`
 *
 * @example
 * const feed = useIncremental((offset, limit) => api.posts({ offset, limit }), { limit: 25 });
 * <For each={feed.items()}>{Post}</For>
 * <button onClick={feed.next} disabled={feed.done() || feed.loading()}>Load more</button>
 */
export function useIncremental<T>(
	source: (offset: number, limit: number) => T[] | Promise<T[]>,
	options?: {
		/** Items per page. @default 20 */
		limit?: number;
		/** Load the first page immediately. @default true */
		immediate?: boolean;
	},
): IncrementalState<T> {
	const limit = options?.limit ?? 20;
	const [items, setItems] = createSignal<T[]>([]);
	const [total, setTotal] = createSignal<number>();
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal<unknown>(undefined);
	let generation = 0;

	const done = () => total() !== undefined;

	const loadPage = () => {
		if (loading() || done()) return;
		const offset = items().length;
		const gen = generation;
		setLoading(true);
		Promise.resolve()
			.then(() => source(offset, limit))
			.then((page) => {
				if (gen !== generation) return;
				const list = page ?? [];
				setItems((prev) => [...prev, ...list]);
				if (list.length < limit) setTotal(offset + list.length);
				setError(undefined);
			})
			.catch((e) => {
				if (gen === generation) setError(e);
			})
			.finally(() => {
				if (gen === generation) setLoading(false);
			});
	};

	if (options?.immediate !== false) loadPage();

	return {
		items,
		loaded: () => items().length,
		total,
		loading,
		error,
		next: loadPage,
		done,
		reset: () => {
			generation++;
			setItems([]);
			setTotal(undefined);
			setLoading(false);
			setError(undefined);
			loadPage();
		},
	};
}
