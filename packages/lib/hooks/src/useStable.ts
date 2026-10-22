/** Referentially-stable callback — `.set` swaps the function it delegates to. */
export interface StableCallback<A extends unknown[], R> {
	(...args: A): R;
	/** Replace the function invoked by the stable wrapper. */
	set: (fn: (...args: A) => R) => void;
}

/**
 * Referentially-stable callback — the returned function never changes
 * identity, so it's safe to pass to memoized children or effects without
 * re-triggering them. It always invokes the most recently installed
 * function (`stable.set(next)`), and closures that read signals naturally
 * see their latest values at call time.
 *
 * @param fn — Initial function to delegate to
 * @returns Stable wrapper with `.set` to install a newer function
 *
 * @example
 * const onSave = useStable((v: string) => api.save(v, draft()));
 * // safe in deps — identity is constant, always calls the latest logic
 * useEventListener(el, "click", onSave);
 */
export function useStable<A extends unknown[], R>(fn: (...args: A) => R): StableCallback<A, R> {
	let latest = fn;
	const stable = ((...args: A) => latest(...args)) as StableCallback<A, R>;
	stable.set = (next) => {
		latest = next;
	};
	return stable;
}
