import { type Accessor, createSignal, onCleanup } from "solid-js";

interface CacheEntry<V> {
	value?: V;
	error?: Error;
	loading: boolean;
	/** Epoch ms of the last successful fetch */
	ts: number;
}

export interface CachedControls<K, V> {
	/**
	 * Accessor for the cached value of `key` — fetches on first call and
	 * refetches automatically once a `ttl` is configured and the entry expires.
	 */
	get: (key: K) => Accessor<V | undefined>;
	/** True while a fetch for `key` is in flight */
	loading: (key: K) => boolean;
	/** Last fetch error for `key` */
	error: (key: K) => Error | undefined;
	/** Drop one entry (next `get` refetches) or every entry when omitted */
	invalidate: (key?: K) => void;
	/** Drop every entry */
	clear: () => void;
	/** Reactive entry count */
	size: Accessor<number>;
}

/**
 * Memoized keyed cache for an async fetcher — `get(key)` returns an accessor
 * that fetches on first use and dedupes concurrent calls. With `ttl`, entries
 * are invalidated on expiry and live accessors refetch automatically.
 *
 * @param fetcher — Resolves the value for a key
 * @param options — `ttl` entry lifetime in ms; without it entries never expire
 * @returns `{ get, loading, error, invalidate, clear, size }`
 *
 * @example
 * const users = useCached((id: number) => fetch(`/api/users/${id}`).then(r => r.json()), { ttl: 60_000 });
 * const name = users.get(42);
 * <p>{users.loading(42) ? "…" : name()?.name}</p>
 */
export function useCached<K, V>(
	fetcher: (key: K) => Promise<V>,
	options?: {
		/** Entry lifetime in ms — expired entries are dropped and refetched. */
		ttl?: number;
	},
): CachedControls<K, V> {
	const [cache, setCache] = createSignal(new Map<K, CacheEntry<V>>());
	const timers = new Map<K, ReturnType<typeof setTimeout>>();

	const patch = (key: K, p: Partial<CacheEntry<V>>) =>
		setCache((m) => {
			const next = new Map(m);
			next.set(key, { loading: false, ts: 0, ...next.get(key), ...p });
			return next;
		});

	const request = (key: K) => {
		const entry = cache().get(key);
		if (entry?.loading) return;
		if (entry?.value !== undefined && entry.error === undefined) {
			const fresh = options?.ttl === undefined || Date.now() - entry.ts < options.ttl;
			if (fresh) return;
		}
		clearTimeout(timers.get(key));
		patch(key, { loading: true, error: undefined });
		if (options?.ttl !== undefined) {
			timers.set(
				key,
				setTimeout(() => invalidate(key), options.ttl),
			);
		}
		fetcher(key)
			.then((value) => patch(key, { value, loading: false, ts: Date.now() }))
			.catch((e) => patch(key, { error: e as Error, loading: false }));
	};

	const invalidate = (key?: K) => {
		if (key === undefined) {
			for (const t of timers.values()) clearTimeout(t);
			timers.clear();
			setCache(new Map());
			return;
		}
		clearTimeout(timers.get(key));
		timers.delete(key);
		setCache((m) => {
			const next = new Map(m);
			next.delete(key);
			return next;
		});
	};

	onCleanup(() => {
		for (const t of timers.values()) clearTimeout(t);
		timers.clear();
	});

	return {
		get: (key) => {
			request(key);
			return () => {
				const entry = cache().get(key);
				if (!entry || (entry.value === undefined && !entry.loading && !entry.error)) {
					queueMicrotask(() => request(key));
				}
				return entry?.value;
			};
		},
		loading: (key) => cache().get(key)?.loading ?? false,
		error: (key) => cache().get(key)?.error,
		invalidate,
		clear: () => invalidate(),
		size: () => cache().size,
	};
}
