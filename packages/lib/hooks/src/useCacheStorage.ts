import { type Accessor, createSignal } from "solid-js";

export interface CacheStorageControls {
	/** Whether the CacheStorage API (`caches`) exists */
	supported: boolean;
	/** First matching `Response` for the request — `undefined` on miss or when unsupported */
	match: (req: RequestInfo | URL) => Promise<Response | undefined>;
	/** Store a request/response pair — resolves `false` when unsupported or on failure */
	put: (req: RequestInfo | URL, res: Response) => Promise<boolean>;
	/** Remove a request — resolves `false` when unsupported, missing, or on failure */
	delete: (req: RequestInfo | URL) => Promise<boolean>;
	/** All cached requests in the named cache — `[]` when unsupported */
	keys: () => Promise<ReadonlyArray<Request>>;
	/** Last error message */
	error: Accessor<string | undefined>;
}

/**
 * Named CacheStorage bucket — lazy `caches.open(name)` shared by all ops.
 * Every method degrades to a benign fallback (`undefined`/`false`/`[]`) where
 * the API is missing instead of throwing.
 *
 * @param name — Cache name. @default "solid-cache"
 * @returns `{ supported, match, put, delete, keys, error }`
 *
 * @example
 * const cache = useCacheStorage("images");
 * const res = (await cache.match(url)) ?? (await fetch(url));
 */
export function useCacheStorage(name = "solid-cache"): CacheStorageControls {
	const supported = typeof caches !== "undefined";
	const [error, setError] = createSignal<string>();
	let opened: Promise<Cache> | undefined;

	const open = () => (opened ??= caches.open(name));

	const wrap = async <T>(fn: (cache: Cache) => Promise<T>): Promise<T | undefined> => {
		if (!supported) return undefined;
		try {
			const result = await fn(await open());
			setError(undefined);
			return result;
		} catch (e) {
			setError(e instanceof Error ? e.message : "CacheStorage operation failed");
			return undefined;
		}
	};

	return {
		supported,
		match: (req) => wrap((c) => c.match(req)),
		put: async (req, res) =>
			(await wrap(async (c) => {
				await c.put(req, res);
				return true;
			})) ?? false,
		delete: async (req) => (await wrap((c) => c.delete(req))) ?? false,
		keys: async () => (await wrap((c) => c.keys())) ?? [],
		error,
	};
}
