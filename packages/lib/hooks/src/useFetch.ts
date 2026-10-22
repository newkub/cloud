import { type Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";

export interface FetchState<T> {
	data: Accessor<T | undefined>;
	error: Accessor<Error | undefined>;
	loading: Accessor<boolean>;
	/** True when `data` was served from the cache instead of the network */
	cached: Accessor<boolean>;
	refetch: () => void;
	abort: () => void;
}

interface FetchCacheEntry {
	data: unknown;
	ts: number;
}

/** Module-level response cache shared by `useFetch` instances. */
const fetchCache = new Map<string, FetchCacheEntry>();

/**
 * Reactive fetch — tracks `input()` and re-requests when it changes.
 * Aborts the previous request automatically; a falsy `input()` aborts the
 * in-flight request without starting a new one. `cacheKey` enables a shared
 * in-memory cache (fresh for `ttl` ms) and `refetchInterval` polls on a timer.
 *
 * @param input — Accessor for the request target (string | URL | Request), falsy skips fetching
 * @param init — Fetch init merged into every request (an abort signal is managed internally)
 * @param options — `cacheKey`/`ttl` for caching, `refetchInterval` for polling
 * @returns `{ data, error, loading, cached, refetch, abort }`
 *
 * @example
 * const api = useFetch<{ name: string }>(() => `/api/user/${id()}`, undefined, { cacheKey: "user", ttl: 30_000 });
 * <p>{api.loading() ? "…" : api.data()?.name}</p>
 */
export function useFetch<T = unknown>(
	input: Accessor<string | URL | Request | undefined>,
	init?: RequestInit,
	options?: {
		/** Cache responses under this key — `true` keys by the request URL. @default false */
		cacheKey?: string | boolean;
		/** Cache entry lifetime in ms — older entries are ignored and refetched. @default Infinity */
		ttl?: number;
		/** Re-request every `ms` (bypasses the cache read). */
		refetchInterval?: number;
	},
): FetchState<T> {
	const [data, setData] = createSignal<T>();
	const [error, setError] = createSignal<Error>();
	const [loading, setLoading] = createSignal(false);
	const [cached, setCached] = createSignal(false);
	let ctrl: AbortController | undefined;

	const keyFor = (target: string | URL | Request) => {
		const key = options?.cacheKey;
		if (key === undefined || key === false) return undefined;
		return key === true ? String(target instanceof Request ? target.url : target) : key;
	};

	const readCache = (key: string | undefined): T | undefined => {
		if (key === undefined) return undefined;
		const entry = fetchCache.get(key);
		if (!entry) return undefined;
		const ttl = options?.ttl ?? Number.POSITIVE_INFINITY;
		if (Date.now() - entry.ts > ttl) {
			fetchCache.delete(key);
			return undefined;
		}
		return entry.data as T;
	};

	const run = (target: string | URL | Request, force = false) => {
		const key = keyFor(target);
		if (!force) {
			const hit = readCache(key);
			if (hit !== undefined) {
				ctrl?.abort();
				setData(() => hit);
				setCached(true);
				setError(undefined);
				setLoading(false);
				return;
			}
		}
		setCached(false);
		ctrl?.abort();
		const c = new AbortController();
		ctrl = c;
		setLoading(true);
		setError(undefined);
		fetch(target, { ...init, signal: c.signal })
			.then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json() as Promise<T>;
			})
			.then((d) => {
				if (key !== undefined) fetchCache.set(key, { data: d, ts: Date.now() });
				setData(() => d);
			})
			.catch((e) => {
				if ((e as Error).name !== "AbortError") setError(e as Error);
			})
			.finally(() => {
				if (ctrl === c) setLoading(false);
			});
	};

	createEffect(() => {
		const target = input();
		if (target) run(target);
		else ctrl?.abort();
	});

	onMount(() => {
		const ms = options?.refetchInterval;
		if (ms === undefined) return;
		const id = setInterval(() => {
			const t = input();
			if (t) run(t, true);
		}, ms);
		onCleanup(() => clearInterval(id));
	});

	onCleanup(() => ctrl?.abort());

	return {
		data,
		error,
		loading,
		cached,
		refetch: () => {
			const t = input();
			if (t) run(t, true);
		},
		abort: () => ctrl?.abort(),
	};
}
