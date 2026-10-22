import { type Accessor, createSignal, onMount } from "solid-js";

export interface InfinitePage<T> {
	/** Items for this page — appended to `items` */
	items: T[];
	/** Cursor for the next page — omit/`undefined` marks the end */
	cursor?: string;
}

export interface InfiniteOptions {
	/** Cursor passed to the first `loadMore` — also restored by `reset()` */
	initialCursor?: string;
	/** Load the first page on mount. @default true */
	immediate?: boolean;
}

export interface InfiniteState<T> {
	/** All loaded items, oldest page first */
	items: Accessor<T[]>;
	/** Fetch the next page — no-op while loading or after `done` */
	loadMore: () => Promise<void>;
	/** True while a page is in flight */
	loading: Accessor<boolean>;
	/** True once the fetcher returns a page without a `cursor` */
	done: Accessor<boolean>;
	/** Last fetcher rejection — cleared on the next successful load */
	error: Accessor<Error | undefined>;
	/** Clear items and rewind to `initialCursor` */
	reset: () => void;
}

/**
 * Cursor-paginated list — `loadMore` calls `fetcher(cursor)`, appends
 * `page.items`, and stores `page.cursor` for the next call. A page without a
 * `cursor` flips `done`. Concurrent `loadMore` calls are guarded (no
 * double-fetch) and stale responses never write state.
 *
 * @param fetcher — `(cursor) => Promise<{ items, cursor? }>` — `undefined` cursor means first page
 * @param options — `initialCursor`, `immediate`
 * @returns `{ items, loadMore, loading, done, error, reset }`
 *
 * @example
 * const feed = useInfinite((cursor) => api.posts({ cursor }));
 * <For each={feed.items()}>{(p) => <Post post={p} />}</For>
 * <button disabled={feed.done()} onClick={feed.loadMore}>load more</button>
 */
export function useInfinite<T>(
	fetcher: (cursor?: string) => Promise<InfinitePage<T>>,
	options?: InfiniteOptions,
): InfiniteState<T> {
	const [items, setItems] = createSignal<T[]>([]);
	const [loading, setLoading] = createSignal(false);
	const [done, setDone] = createSignal(false);
	const [error, setError] = createSignal<Error>();
	let cursor: string | undefined = options?.initialCursor;
	let runId = 0;

	const loadMore = async () => {
		if (loading() || done()) return;
		const id = ++runId;
		setLoading(true);
		try {
			const page = await fetcher(cursor);
			if (id !== runId) return;
			setItems((list) => [...list, ...page.items]);
			cursor = page.cursor;
			setDone(page.cursor === undefined);
			setError(undefined);
		} catch (e) {
			if (id === runId) setError(e as Error);
		} finally {
			if (id === runId) setLoading(false);
		}
	};

	const reset = () => {
		runId += 1;
		cursor = options?.initialCursor;
		setItems([]);
		setDone(false);
		setError(undefined);
		setLoading(false);
	};

	onMount(() => {
		if (options?.immediate !== false) void loadMore();
	});

	return { items, loadMore, loading, done, error, reset };
}
