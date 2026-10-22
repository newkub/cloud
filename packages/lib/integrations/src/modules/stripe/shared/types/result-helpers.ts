// ============================================================================
// Shared Kernel - Result Helper Functions
// ============================================================================

import type { Result } from "./result-either";
import { failure, isFailure, isSuccess, success } from "./result-either";

export { failure, isFailure, isSuccess, success } from "./result-either";

export const mapResult = <T, U, E extends Error>(
	result: Result<T, E>,
	fn: (data: T) => U,
): Result<U, E> => {
	if (isSuccess(result)) {
		return success(fn(result.data)) as Result<U, E>;
	}
	return result as Result<U, E>;
};

export const flatMapResult = <T, U, E extends Error>(
	result: Result<T, E>,
	fn: (data: T) => Result<U, E>,
): Result<U, E> => {
	if (isSuccess(result)) {
		return fn(result.data);
	}
	return result as Result<U, E>;
};

export const mapError = <T, E extends Error, F extends Error>(
	result: Result<T, E>,
	fn: (error: E) => F,
): Result<T, F> => {
	if (isFailure(result)) {
		return failure(fn(result.error));
	}
	return result as Result<T, F>;
};

export const asyncSuccess = <T>(
	data: T,
): Promise<{ success: true; data: T; error?: undefined }> => {
	return Promise.resolve({ success: true, data });
};

export const asyncFailure = <E extends Error>(
	error: E,
): Promise<{ success: false; data?: undefined; error: E }> => {
	return Promise.resolve({
		success: false,
		error: error || new Error("Unknown error"),
	});
};
