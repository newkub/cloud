export interface WebLockOptions {
	/** `"shared"` allows concurrent shared holders; `"exclusive"` serializes. @default "exclusive" */
	mode?: "exclusive" | "shared";
	/** Resolve immediately with a `null` lock instead of queueing when the lock is held */
	ifAvailable?: boolean;
	/** Break a lock already held by another context — use sparingly */
	steal?: boolean;
	/** Abort a queued lock request */
	signal?: AbortSignal;
}

interface LockManagerLike {
	request(name: string, ...args: readonly unknown[]): Promise<unknown>;
}

const lockManager = (): LockManagerLike | undefined =>
	typeof navigator === "undefined" ? undefined : (navigator as { locks?: LockManagerLike }).locks;

export interface WebLockState {
	/** `navigator.locks` support flag */
	supported: boolean;
	/**
	 * Run `callback` while holding the named lock — resolves with the callback's
	 * return value. Resolves `undefined` when the API is missing; rejections
	 * (aborted lock, callback throw) propagate to the caller.
	 */
	acquire: <T>(name: string, callback: () => T | Promise<T>, options?: WebLockOptions) => Promise<T | undefined>;
}

/**
 * Web Locks (`navigator.locks`) — serialize work across tabs and workers.
 * `acquire(name, cb)` queues the named lock, runs `cb` while held, and resolves
 * with its result; pass `options` for `mode: "shared"`, `ifAvailable`, `steal`,
 * or an abort `signal`. Unsupported environments resolve `undefined`.
 *
 * @returns `{ supported, acquire }`
 *
 * @example
 * const locks = useWebLock();
 * const saved = await locks.acquire("db-write", () => persist(draft()));
 */
export function useWebLock(): WebLockState {
	const supported = typeof lockManager()?.request === "function";

	const acquire = async <T>(
		name: string,
		callback: () => T | Promise<T>,
		options?: WebLockOptions,
	): Promise<T | undefined> => {
		const locks = lockManager();
		if (!locks || typeof locks.request !== "function") return undefined;
		const result = options ? await locks.request(name, options, callback) : await locks.request(name, callback);
		return result as T;
	};

	return { supported, acquire };
}
