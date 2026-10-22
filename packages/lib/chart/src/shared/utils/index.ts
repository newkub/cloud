// Pure utility functions

export const pipe = <T>(value: T) => ({
	chain: <U>(fn: (x: T) => U) => pipe(fn(value)),
});

export const compose =
	<T, U, V>(f: (x: U) => V, g: (x: T) => U) =>
	(x: T) =>
		f(g(x));

export const curry = <T extends (...args: never[]) => unknown>(fn: T) => {
	return function curried(...args: never[]) {
		if (args.length >= fn.length) {
			return fn(...args);
		}
		return (...nextArgs: never[]) => curried(...args, ...nextArgs);
	};
};

export const identity = <T>(x: T): T => x;

export const always =
	<T>(value: T) =>
	() =>
		value;

export const memoize = <T extends (...args: never[]) => unknown>(fn: T): T => {
	const cache = new Map();
	return ((...args: never[]) => {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return cache.get(key);
		}
		const result = fn(...args);
		cache.set(key, result);
		return result;
	}) as T;
};

// Array utilities
export const map =
	<T, U>(fn: (x: T) => U) =>
	(array: readonly T[]): readonly U[] =>
		array.map(fn);

export const filter =
	<T>(predicate: (x: T) => boolean) =>
	(array: readonly T[]): readonly T[] =>
		array.filter(predicate);

export const reduce =
	<T, U>(fn: (acc: U, x: T) => U, initial: U) =>
	(array: readonly T[]): U =>
		array.reduce(fn, initial);

export const find =
	<T>(predicate: (x: T) => boolean) =>
	(array: readonly T[]): T | undefined =>
		array.find(predicate);

export const someArray =
	<T>(predicate: (x: T) => boolean) =>
	(array: readonly T[]): boolean =>
		array.some(predicate);

export const every =
	<T>(predicate: (x: T) => boolean) =>
	(array: readonly T[]): boolean =>
		array.every(predicate);

// Number utilities
export const clamp =
	(min: number, max: number) =>
	(value: number): number =>
		Math.max(min, Math.min(max, value));

export const round =
	(precision: number) =>
	(value: number): number =>
		Math.round(value * 10 ** precision) / 10 ** precision;

export const lerp =
	(start: number, end: number) =>
	(progress: number): number =>
		start + (end - start) * progress;
export * from "./accessibility";
