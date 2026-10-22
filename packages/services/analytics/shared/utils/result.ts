/**
 * Result Utility
 * Functional implementation of Result type for error handling
 */

import type { Result } from "#analytics/shared/types";

export const ok = <T>(data: T): Result<T> => ({
	success: true,
	data,
});

export const err = <E = Error>(error: E): Result<never, E> => ({
	success: false,
	error,
});

export const isOk = <T, E>(
	result: Result<T, E>,
): result is { success: true; data: T } => result.success;

export const isErr = <T, E>(
	result: Result<T, E>,
): result is { success: false; error: E } => !result.success;

export const map = <T, U, E>(
	result: Result<T, E>,
	fn: (data: T) => U,
): Result<U, E> =>
	isOk(result)
		? (ok(fn(result.data)) as Result<U, E>)
		: (result as Result<U, E>);

export const mapError = <T, E, F>(
	result: Result<T, E>,
	fn: (error: E) => F,
): Result<T, F> =>
	isErr(result)
		? (err(fn(result.error)) as Result<T, F>)
		: (result as Result<T, F>);

export const chain = <T, U, E>(
	result: Result<T, E>,
	fn: (data: T) => Result<U, E>,
): Result<U, E> => (isOk(result) ? fn(result.data) : (result as Result<U, E>));

export const unwrap = <T, E>(result: Result<T, E>, defaultValue?: T): T => {
	if (isOk(result)) return result.data;
	if (defaultValue !== undefined) return defaultValue;
	throw (result as { success: false; error: E }).error;
};

export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T =>
	isOk(result) ? result.data : defaultValue;

export const unwrapErr = <T, E>(result: Result<T, E>): E => {
	if (isErr(result)) return result.error;
	throw new Error("Cannot unwrap error from Ok result");
};
