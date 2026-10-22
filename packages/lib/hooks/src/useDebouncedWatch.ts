import { type Accessor, createEffect, createRoot, on, onCleanup } from "solid-js";

/** A map of named accessors watched with per-key debounce windows. */
export type WatchSourceMap = Record<string, Accessor<unknown>>;

/** Options for {@link useDebouncedWatch}. */
export interface DebouncedWatchOptions {
	/** Trailing window in ms — a per-key map when `source` is a keyed object. @default 0 */
	debounce?: number | Record<string, number>;
	/** Force a flush at most this many ms after the first suppressed change. */
	maxWait?: number;
	/** `"pre"` calls the callback synchronously on flush, `"post"` in a microtask. @default "pre" */
	flush?: "pre" | "post";
	/** Replace the default timer entirely — call `fire()` whenever appropriate. */
	eventFilter?: (fire: () => void) => void;
}

/**
 * Debounced `useWatch` — trailing-edge only. Rapid changes collapse into one
 * callback invocation once the quiet window passes. `source` may be a single
 * accessor or a keyed object of accessors; with the latter, each key gets its
 * own timer (`debounce` as a map) and the callback receives the merged
 * `{ key: value }` snapshot. Returns a `stop()` handle; also stops with the
 * owning scope.
 *
 * @param source — Accessor or keyed accessor map to observe
 * @param callback — `(value, previous)` where both are the (single or merged) snapshot
 * @param options — `debounce`, `maxWait`, `flush`, `eventFilter`
 * @returns `stop()` — detach the watcher early
 *
 * @example
 * useDebouncedWatch(query, (q, prev) => search(q), { debounce: 300, maxWait: 1000 });
 * useDebouncedWatch({ width, height }, (v) => resize(v), { debounce: { width: 100, height: 200 } });
 */
export function useDebouncedWatch(
	source: Accessor<unknown> | WatchSourceMap,
	callback: (value: unknown, previous: unknown) => void,
	options?: DebouncedWatchOptions,
): () => void {
	const keyed = typeof source !== "function";
	const entries: [string, Accessor<unknown>][] = keyed
		? Object.entries(source as WatchSourceMap)
		: [["", source as Accessor<unknown>]];
	const delivered: Record<string, unknown> = {};
	const pending: Record<string, unknown> = {};
	const timers: Record<string, ReturnType<typeof setTimeout> | undefined> = {};
	for (const [key, get] of entries) delivered[key] = get();

	const snapshot = (map: Record<string, unknown>) => (keyed ? { ...map } : map[""]);
	let last = snapshot(delivered);
	let firstPendingAt = -1;

	const fire = (key: string) => {
		if (!(key in pending)) return;
		delivered[key] = pending[key];
		delete pending[key];
		if (Object.keys(pending).length === 0) firstPendingAt = -1;
		const value = snapshot(delivered);
		const previous = last;
		last = value;
		if (options?.flush === "post") void Promise.resolve().then(() => callback(value, previous));
		else callback(value, previous);
	};

	const schedule = (key: string, value: unknown) => {
		pending[key] = value;
		if (firstPendingAt < 0) firstPendingAt = Date.now();
		const debounce = options?.debounce;
		const perKey = keyed && debounce !== undefined && typeof debounce === "object";
		const ms = typeof debounce === "number" ? debounce : perKey ? ((debounce as Record<string, number>)[key] ?? 0) : 0;
		const overdue = options?.maxWait !== undefined && Date.now() - firstPendingAt >= options.maxWait;
		clearTimeout(timers[key]);
		timers[key] = undefined;
		if (options?.eventFilter) {
			options.eventFilter(() => fire(key));
			return;
		}
		if (overdue) {
			fire(key);
			return;
		}
		timers[key] = setTimeout(() => fire(key), ms);
	};

	const dispose = createRoot((d) => {
		for (const [key, get] of entries) {
			createEffect(
				on(
					get,
					(value) => {
						schedule(key, value);
					},
					{ defer: true },
				),
			);
		}
		return () => {
			for (const timer of Object.values(timers)) clearTimeout(timer);
			d();
		};
	});
	onCleanup(dispose);
	return dispose;
}
