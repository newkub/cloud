// ============================================================================
// Shared Kernel - Function Utilities (debounce, throttle, memoize)
// ============================================================================

export const debounce = <T extends readonly unknown[]>(
	fn: (...args: T) => void,
	delay: number,
): ((...args: T) => void) => {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: T) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

export const throttle = <T extends readonly unknown[]>(
	fn: (...args: T) => void,
	delay: number,
): ((...args: T) => void) => {
	let lastCall = 0;

	return (...args: T) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			fn(...args);
		}
	};
};

export const memoize = <T, R>(
	fn: (...args: T[]) => R,
	keyFn?: (...args: T[]) => string,
): ((...args: T[]) => R) => {
	const cache = new Map<string, R>();

	return (...args: T[]): R => {
		const key = keyFn ? keyFn(...args) : JSON.stringify(args);

		if (cache.has(key)) {
			return cache.get(key) as R;
		}

		const result = fn(...args);
		cache.set(key, result);
		return result;
	};
};
