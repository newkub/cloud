// ============================================================================
// Shared Kernel - Object Utilities
// ============================================================================

export const merge = <T extends Record<string, unknown>>(
	...objects: readonly Partial<T>[]
): T => {
	return Object.assign({}, ...objects) as unknown as T;
};

export const deepMerge = <T extends Record<string, unknown>>(
	...objects: readonly Partial<T>[]
): T => {
	const result = {} as T;

	for (const obj of objects) {
		for (const key in obj) {
			if (Object.hasOwn(obj, key)) {
				const value = obj[key];
				const existing = result[key];

				if (
					existing &&
					typeof existing === "object" &&
					typeof value === "object" &&
					!Array.isArray(value)
				) {
					(result as Record<string, unknown>)[key] = deepMerge(
						existing as Record<string, unknown>,
						value as Record<string, unknown>,
					);
				} else {
					(result as Record<string, unknown>)[key] = value;
				}
			}
		}
	}

	return result;
};

export const pickBy =
	<T extends Record<string, unknown>>(
		predicate: (key: string, value: unknown) => boolean,
	) =>
	(obj: T): Partial<T> => {
		const result = {} as Partial<T>;

		for (const key in obj) {
			if (Object.hasOwn(obj, key) && predicate(key, obj[key])) {
				(result as Record<string, unknown>)[key] = obj[key];
			}
		}

		return result;
	};
