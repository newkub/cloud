import { type Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

interface CacheEntry {
	data: unknown;
	ts: number;
}

/** Module-level cache shared by every useSwr instance — survives remounts. */
const cache = new Map<string, CacheEntry>();
/** In-flight dedupe — concurrent consumers share one request per key. */
const inflight = new Map<string, Promise<unknown>>();

/** Drop every cached entry — mostly useful in tests. */
export const clearSwrCache = () => {
	cache.clear();
	inflight.clear();
};

export interface SwrOptions {
	/** Milliseconds a cached value counts as fresh — skips refetch. @default 5000 */
	ttl?: number;
	/** Revalidate on this interval (ms) while mounted. @default 0 (off) */
	refreshInterval?: number;
}

export interface SwrState<T> {
	/** Cached or freshly fetched data */
	data: Accessor<T | undefined>;
	error: Accessor<Error | undefined>;
	/** True while a fetch is in flight (including background revalidation) */
	loading: Accessor<boolean>;
	/** Force a revalidation, bypassing `ttl` */
	revalidate: () => void;
}

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * Stale-while-revalidate fetching — serves the module-level cache instantly,
 * then revalidates in the background when the entry is older than `ttl`.
 * In-flight requests are deduped across components sharing a `key`, and
 * `key` may be an accessor — changing it re-runs the lookup.
 *
 * @param key — Cache key, or an accessor returning it
 * @param fetcher — `(key) => Promise<T>` used to (re)populate the cache
 * @param options — `ttl` freshness window, `refreshInterval` background poll
 * @returns `{ data, error, loading, revalidate }`
 *
 * @example
 * const todo = useSwr("todo:1", (k) => fetch(`/api/${k}`).then(r => r.json()), { ttl: 30_000 });
 * <p>{todo.data()?.title ?? "…"}</p>
 */
export function useSwr<T = unknown>(
	key: MaybeAccessor<string>,
	fetcher: (key: string) => Promise<T>,
	options?: SwrOptions,
): SwrState<T> {
	const [data, setData] = createSignal<T>();
	const [error, setError] = createSignal<Error>();
	const [loading, setLoading] = createSignal(false);
	let current = "";

	const load = (k: string, force = false) => {
		const hit = cache.get(k);
		if (hit) setData(() => hit.data as T);
		const fresh = hit !== undefined && Date.now() - hit.ts < (options?.ttl ?? 5000);
		if (fresh && !force) {
			setLoading(false);
			return;
		}
		setLoading(true);
		let pending = inflight.get(k);
		if (!pending) {
			pending = fetcher(k);
			inflight.set(k, pending);
		}
		pending
			.then((d) => {
				cache.set(k, { data: d, ts: Date.now() });
				if (current === k) {
					setData(() => d as T);
					setError(undefined);
				}
			})
			.catch((e) => {
				if (current === k) setError(e as Error);
			})
			.finally(() => {
				inflight.delete(k);
				if (current === k) setLoading(false);
			});
	};

	createEffect(() => {
		current = read(key);
		setError(undefined);
		load(current);
	});

	onMount(() => {
		const interval = options?.refreshInterval ?? 0;
		if (interval <= 0) return;
		const id = setInterval(() => load(current, true), interval);
		onCleanup(() => clearInterval(id));
	});

	return { data, error, loading, revalidate: () => load(current, true) };
}
