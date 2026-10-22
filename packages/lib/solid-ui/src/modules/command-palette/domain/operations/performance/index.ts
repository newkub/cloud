/**
 * Search Performance Operations - Performance optimization for search
 */

import type { SearchResult } from "../../../ports/index";

// Debounce configuration
export interface DebounceConfig {
	readonly delay: number; // milliseconds
	readonly maxWait?: number; // maximum wait time
}

// Cache configuration
export interface CacheConfig {
	readonly maxSize: number;
	readonly ttl: number; // time to live in milliseconds
}

// Cache entry
export interface CacheEntry {
	readonly query: string;
	readonly result: SearchResult;
	readonly timestamp: number;
}

// Search cache state
export interface SearchCacheState {
	readonly entries: readonly CacheEntry[];
	readonly maxSize: number;
	readonly ttl: number;
}

// Create cache state
export const createCacheState = (config: CacheConfig): SearchCacheState => ({
	entries: [],
	maxSize: config.maxSize,
	ttl: config.ttl,
});

// Get from cache
export const getFromCache = (state: SearchCacheState, query: string): SearchResult | undefined => {
	const now = Date.now();
	const entry = state.entries.find((e) => e.query === query);

	if (!entry) return undefined;

	// Check if entry is expired
	if (now - entry.timestamp > state.ttl) {
		return undefined;
	}

	return entry.result;
};

// Set to cache
export const setToCache = (state: SearchCacheState, query: string, result: SearchResult): SearchCacheState => {
	const now = Date.now();
	const newEntry: CacheEntry = {
		query,
		result,
		timestamp: now,
	};

	// Remove expired entries
	const validEntries = state.entries.filter((e) => now - e.timestamp <= state.ttl);

	// Add new entry
	const updatedEntries = [newEntry, ...validEntries];

	// Limit size
	const limitedEntries = updatedEntries.slice(0, state.maxSize);

	return {
		...state,
		entries: limitedEntries,
	};
};

// Clear cache
export const clearCache = (state: SearchCacheState): SearchCacheState => ({
	...state,
	entries: [],
});

// Debounce function
export const createDebounce = (config: DebounceConfig) => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let lastCallTime = 0;

	return <T extends (...args: unknown[]) => unknown>(fn: T): ((...args: Parameters<T>) => void) => {
		return (...args: Parameters<T>) => {
			const now = Date.now();
			const timeSinceLastCall = now - lastCallTime;

			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			// Calculate delay (respect maxWait)
			const delay = config.maxWait ? Math.min(config.delay, config.maxWait - timeSinceLastCall) : config.delay;

			timeoutId = setTimeout(
				() => {
					fn(...args);
					timeoutId = null;
				},
				Math.max(0, delay),
			);

			lastCallTime = now;
		};
	};
};

// Throttle function for rapid updates
export const createThrottle = (delay: number) => {
	let lastCallTime = 0;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return <T extends (...args: unknown[]) => unknown>(fn: T): ((...args: Parameters<T>) => void) => {
		return (...args: Parameters<T>) => {
			const now = Date.now();
			const timeSinceLastCall = now - lastCallTime;

			if (timeSinceLastCall >= delay) {
				fn(...args);
				lastCallTime = now;
			} else if (!timeoutId) {
				timeoutId = setTimeout(() => {
					fn(...args);
					lastCallTime = Date.now();
					timeoutId = null;
				}, delay - timeSinceLastCall);
			}
		};
	};
};

// Memoize search results
export const memoizeSearch = (
	cache: SearchCacheState,
	query: string,
	searchFn: () => Promise<SearchResult>,
): Promise<SearchResult> => {
	const cached = getFromCache(cache, query);
	if (cached) {
		return Promise.resolve(cached);
	}

	return searchFn();
};
