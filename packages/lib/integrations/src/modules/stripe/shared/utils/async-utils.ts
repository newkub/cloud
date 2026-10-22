// ============================================================================
// Shared Kernel - Async Utilities
// ============================================================================

export const asyncPipe =
	<T>(value: Promise<T>) =>
	<U>(fn: (x: T) => Promise<U>): Promise<U> =>
		value.then(fn);

export const asyncMap =
	<T, U>(fn: (x: T) => Promise<U>) =>
	(array: readonly T[]): Promise<readonly U[]> =>
		Promise.all(array.map(fn));

export const asyncFilter =
	<T>(predicate: (x: T) => Promise<boolean>) =>
	(array: readonly T[]): Promise<readonly T[]> =>
		Promise.all(
			array.map(async (item) => ({
				item,
				keep: await predicate(item),
			})),
		).then((results) => results.filter((r) => r.keep).map((r) => r.item));

export const asyncReduce =
	async <T, U>(
		fn: (acc: U, x: T) => Promise<U>,
		initial: U,
	): Promise<(array: readonly T[]) => Promise<U>> =>
	(array: readonly T[]): Promise<U> =>
		array.reduce(
			async (acc: Promise<U>, item: T) => fn(await acc, item),
			Promise.resolve(initial),
		);
