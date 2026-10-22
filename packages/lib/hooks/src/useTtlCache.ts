import { type Accessor, createSignal, onCleanup } from "solid-js";

interface TtlEntry<V> {
	value: V;
	/** Epoch ms when the entry expires — `Infinity` when no TTL applies */
	expires: number;
}

export interface TtlCacheControls<K, V> {
	/** Cached value for `key` — `undefined` when absent or expired */
	get: (key: K) => V | undefined;
	/**
	 * Store `value` under `key`. `ttlMs` overrides `defaultTtl` for this entry;
	 * pass `Infinity` (or omit both) for an entry that never expires.
	 */
	set: (key: K, value: V, ttlMs?: number) => void;
	/** True when `key` maps to a live (unexpired) entry */
	has: (key: K) => boolean;
	/** Drop one entry */
	delete: (key: K) => void;
	/** Drop every entry */
	clear: () => void;
	/** Drop every expired entry — returns how many were removed */
	prune: () => number;
	/** Reactive live-entry count (expired entries excluded after `prune`/access) */
	size: Accessor<number>;
}

/**
 * Keyed in-memory cache with per-entry TTL — `set` stamps an expiry, `get`/
 * `has` treat expired entries as absent, and `prune` sweeps them eagerly.
 * Reads go through a signal-backed map, so `get(key)` inside JSX/effects is
 * reactive. Optional `storage` persists entries as JSON (values must be
 * serializable); expired entries are dropped on load. SSR-safe.
 *
 * @param options — `defaultTtl` applied when `set` omits `ttlMs`; `storage`
 * plus `storageKey` enable persistence (e.g. `localStorage`)
 * @returns `{ get, set, has, delete, clear, prune, size }`
 *
 * @example
 * const cache = useTtlCache<string, User>({ defaultTtl: 30_000 });
 * cache.set("me", user);
 * <p>{cache.get("me")?.name ?? "stale"}</p>
 */
export function useTtlCache<K, V>(options?: {
	/** TTL in ms applied to entries set without an explicit `ttlMs`. */
	defaultTtl?: number;
	/** `Storage` to persist entries into (e.g. `localStorage`) — needs `storageKey`. */
	storage?: Storage;
	/** Key used when persisting to `storage`. @default "ttl-cache" */
	storageKey?: string;
}): TtlCacheControls<K, V> {
	const storage = options?.storage;
	const storageKey = options?.storageKey ?? "ttl-cache";

	const load = (): Map<K, TtlEntry<V>> => {
		if (!storage) return new Map();
		try {
			const raw = storage.getItem(storageKey);
			if (raw === null) return new Map();
			const entries = JSON.parse(raw) as [K, TtlEntry<V>][];
			const now = Date.now();
			// `Infinity` serializes to `null` — revive it so no-TTL entries
			// aren't treated as expired on load.
			return new Map(
				entries
					.filter(([, e]) => (e.expires ?? Number.POSITIVE_INFINITY) > now)
					.map(([k, e]): [K, TtlEntry<V>] => [k, { value: e.value, expires: e.expires ?? Number.POSITIVE_INFINITY }]),
			);
		} catch {
			return new Map();
		}
	};

	const [cache, setCache] = createSignal(load());

	const persist = (map: Map<K, TtlEntry<V>>) => {
		if (!storage) return;
		try {
			storage.setItem(storageKey, JSON.stringify([...map.entries()]));
		} catch {
			// quota exceeded or unserializable value — keep the in-memory map
		}
	};

	const live = (key: K): TtlEntry<V> | undefined => {
		const entry = cache().get(key);
		if (entry === undefined) return undefined;
		if (entry.expires <= Date.now()) {
			remove(key);
			return undefined;
		}
		return entry;
	};

	const update = (mutate: (next: Map<K, TtlEntry<V>>) => void) => {
		const next = new Map(cache());
		mutate(next);
		setCache(next);
		persist(next);
	};

	const remove = (key: K) => update((next) => void next.delete(key));

	// Persist on dispose so a `delete` racing storage failure still settles —
	// mostly a no-op since every mutation persists, but cheap insurance for
	// runtimes where cleanup ordering matters.
	onCleanup(() => persist(cache()));

	return {
		get: (key) => live(key)?.value,
		set: (key, value, ttlMs) => {
			const ttl = ttlMs ?? options?.defaultTtl;
			const expires = ttl === undefined ? Number.POSITIVE_INFINITY : Date.now() + ttl;
			update((next) => next.set(key, { value, expires }));
		},
		has: (key) => live(key) !== undefined,
		delete: remove,
		clear: () => update((next) => next.clear()),
		prune: () => {
			const now = Date.now();
			let removed = 0;
			update((next) => {
				for (const [key, entry] of next) {
					if (entry.expires <= now) {
						next.delete(key);
						removed++;
					}
				}
			});
			return removed;
		},
		size: () => cache().size,
	};
}
