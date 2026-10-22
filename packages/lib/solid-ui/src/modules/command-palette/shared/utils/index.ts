/**
 * Shared Utils - Pure utility functions
 */

import type { Option, Result } from "../types";

// String utilities
export const isEmpty = (str: string): boolean => str.trim().length === 0;
export const isNotEmpty = (str: string): boolean => !isEmpty(str);

// Array utilities
export const isEmptyArray = <T>(arr: readonly T[]): boolean => arr.length === 0;
export const isNotEmptyArray = <T>(arr: readonly T[]): boolean => !isEmptyArray(arr);

// Object utilities
export const hasProperty = <K extends string | number | symbol>(obj: unknown, prop: K): obj is Record<K, unknown> =>
	obj !== null && typeof obj === "object" && prop in obj;

// Function utilities
export const pipe =
	<A>(value: A) =>
	<B>(fn: (a: A) => B): B =>
		fn(value);
export const compose =
	<B, C>(f: (b: B) => C) =>
	<A>(g: (a: A) => B) =>
	(a: A): C =>
		f(g(a));

// Result utilities
export const success = <T>(data: T): Result<T> => ({ success: true, data });
export const failure = <E = Error>(error: E): Result<never, E> => ({
	success: false,
	error,
});

// Option utilities
export const fromNullable = <T>(value: T | null | undefined): Option<T> =>
	value !== null && value !== undefined ? { _tag: "Some", value } : { _tag: "None" };

export const mapOption = <A, B>(option: Option<A>, fn: (a: A) => B): Option<B> =>
	option._tag === "Some" ? { _tag: "Some", value: fn(option.value) } : option;

export const foldOption = <A, B>(option: Option<A>, onNone: () => B, onSome: (a: A) => B): B =>
	option._tag === "Some" ? onSome(option.value) : onNone();

// Validation utilities
export const validateString = (value: unknown, fieldName: string): Result<string> => {
	if (typeof value !== "string") {
		return failure(new Error(`${fieldName} must be a string`));
	}
	if (isEmpty(value)) {
		return failure(new Error(`${fieldName} cannot be empty`));
	}
	return success(value);
};

export const validateRequired = <T>(value: T | undefined, fieldName: string): Result<T> => {
	if (value === undefined) {
		return failure(new Error(`${fieldName} is required`));
	}
	return success(value);
};

// Async utilities
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const withTimeout = <T>(
	promise: Promise<T>,
	timeoutMs: number,
	timeoutError: Error = new Error("Operation timed out"),
): Promise<T> =>
	Promise.race([
		promise,
		sleep(timeoutMs).then(() => {
			throw timeoutError;
		}),
	]);

// Function memoization
export const memoize = <A extends readonly unknown[], B>(
	fn: (...args: A) => B,
	getKey: (...args: A) => string = (...args) => JSON.stringify(args),
): ((...args: A) => B) => {
	const cache = new Map<string, B>();

	return (...args: A): B => {
		const key = getKey(...args);
		if (cache.has(key)) {
			return cache.get(key) as B;
		}
		const result = fn(...args);
		cache.set(key, result);
		return result;
	};
};

// Text utilities
export const getHighlightedText = (text: string, query: string, className: string = "highlight"): string => {
	if (!query) return text;
	const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
	return text.replace(regex, `<span class="${className}">$1</span>`);
};
