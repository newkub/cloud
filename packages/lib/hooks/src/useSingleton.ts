const registry = new Map<unknown, { value: unknown; factory: () => unknown }>();

/**
 * One instance per key across the whole app — the `factory` runs at most
 * once, and every later call with the same `key` returns the original
 * instance. Registering a *different* factory for an already-used key
 * logs a warning and still returns the existing instance, so a key can
 * never be double-instantiated.
 *
 * @param key — Registry key (string, symbol, or object identity)
 * @param factory — Invoked once to create the instance
 * @returns The singleton instance for `key`
 *
 * @example
 * const socket = useSingleton("chat-socket", () => new ChatSocket(url));
 */
export function useSingleton<T>(key: unknown, factory: () => T): T {
	const existing = registry.get(key);
	if (existing) {
		if (existing.factory !== factory) {
			console.warn(
				"[useSingleton] key already registered with a different factory — returning the existing instance",
				key,
			);
		}
		return existing.value as T;
	}
	const value = factory();
	registry.set(key, { value, factory });
	return value;
}
