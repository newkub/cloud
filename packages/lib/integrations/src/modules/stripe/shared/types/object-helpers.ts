// ============================================================================
// Shared Kernel - Object Utilities
// ============================================================================

export const pick =
	<K extends string | number | symbol>(keys: readonly K[]) =>
	<T extends Record<K, unknown>>(obj: T): Pick<T, K> => {
		const result = {} as Pick<T, K>;
		for (const key of keys) {
			if (key in obj) {
				result[key] = obj[key];
			}
		}
		return result;
	};

export const omit =
	<K extends string | number | symbol>(keys: readonly K[]) =>
	<T extends Record<K, unknown>>(obj: T): Omit<T, K> => {
		const result = { ...obj } as Omit<T, K>;
		for (const key of keys) {
			delete result[key as unknown as keyof Omit<T, K>];
		}
		return result;
	};
