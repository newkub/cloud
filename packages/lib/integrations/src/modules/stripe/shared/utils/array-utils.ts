// ============================================================================
// Shared Kernel - Array Composition Utilities
// ============================================================================

export const flatMap =
	<T, U>(fn: (x: T) => readonly U[]) =>
	(array: readonly T[]): readonly U[] => {
		const result: U[] = [];
		for (const item of array) {
			result.push(...fn(item));
		}
		return result;
	};

export const compact = <T>(
	array: readonly (T | null | undefined)[],
): readonly T[] =>
	array.filter((item): item is T => item !== null && item !== undefined);

export const uniq = <T>(array: readonly T[]): readonly T[] => {
	const seen = new Set<T>();
	return array.filter((item) => {
		if (seen.has(item)) {
			return false;
		}
		seen.add(item);
		return true;
	});
};

export const uniqBy =
	<T, K>(keyFn: (item: T) => K) =>
	(array: readonly T[]): readonly T[] => {
		const seen = new Set<K>();
		return array.filter((item) => {
			const key = keyFn(item);
			if (seen.has(key)) {
				return false;
			}
			seen.add(key);
			return true;
		});
	};

export const groupBy =
	<T, K>(keyFn: (item: T) => K) =>
	(array: readonly T[]): ReadonlyMap<K, readonly T[]> => {
		const groups = new Map<K, readonly T[]>();

		for (const item of array) {
			const key = keyFn(item);
			const existing = groups.get(key) || [];
			groups.set(key, [...existing, item]);
		}

		return groups;
	};

export const sortBy =
	<T>(keyFn: (item: T) => number | string) =>
	(array: readonly T[]): readonly T[] =>
		[...array].sort((a, b) => {
			const aKey = keyFn(a);
			const bKey = keyFn(b);

			if (aKey < bKey) return -1;
			if (aKey > bKey) return 1;
			return 0;
		});

export const partition =
	<T>(predicate: (item: T) => boolean) =>
	(array: readonly T[]): [readonly T[], readonly T[]] => {
		const truthy: T[] = [];
		const falsy: T[] = [];

		for (const item of array) {
			if (predicate(item)) {
				truthy.push(item);
			} else {
				falsy.push(item);
			}
		}

		return [truthy, falsy];
	};
