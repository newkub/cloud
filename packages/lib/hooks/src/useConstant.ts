/**
 * Compute a value exactly once per mount — the result is stable for the
 * lifetime of the owner, like `useMemo` in React but guaranteed never to
 * recompute. Use it for expensive objects (class instances, compiled
 * regexes, non-reactive stores) that must keep a single identity.
 *
 * @param init — Factory invoked once during setup
 * @returns The initialised value (not an accessor — it never changes)
 *
 * @example
 * const engine = useConstant(() => new SearchEngine(corpus));
 */
export function useConstant<T>(init: () => T): T {
	return init();
}
