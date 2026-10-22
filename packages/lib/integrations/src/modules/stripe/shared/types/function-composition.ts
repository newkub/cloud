// ============================================================================
// Shared Kernel - Function Composition Utilities
// ============================================================================

export const pipe =
	<T>(value: T) =>
	<U>(fn: (x: T) => U): U =>
		fn(value);

export const pipeAsync =
	<T>(value: T) =>
	<U>(fn: (x: T) => Promise<U>): Promise<U> =>
		fn(value);

export const compose =
	<T, U>(fn2: (x: T) => U) =>
	<V>(fn1: (x: V) => T) =>
	(x: V): U =>
		fn2(fn1(x));

export const curry =
	<T, U, R>(fn: (a: T, b: U) => R): ((a: T) => (b: U) => R) =>
	(a: T) =>
	(b: U): R =>
		fn(a, b);

export const always =
	<T>(value: T): (() => T) =>
	() =>
		value;

export const identity = <T>(x: T): T => x;
