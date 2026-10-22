// ============================================================================
// Shared Kernel - Async Result Helper Functions
// ============================================================================

import type { AsyncResult } from "./result-either";
import { failure, isSuccess, mapResult, success } from "./result-either";

export const asyncSuccess = <T>(data: T): AsyncResult<T> =>
	Promise.resolve(success(data));

export const asyncFailure = <E>(error: E): AsyncResult<never, E> =>
	Promise.resolve(failure(error));

export const mapAsyncResult = <T, U, E extends Error>(
	result: AsyncResult<T, E>,
	fn: (data: T) => U,
): AsyncResult<U, E> => result.then((r) => mapResult(r, fn));

export const flatMapAsyncResult = <T, U, E extends Error>(
	result: AsyncResult<T, E>,
	fn: (data: T) => AsyncResult<U, E>,
): AsyncResult<U, E> =>
	result.then((r) => {
		if (isSuccess(r)) {
			return fn(r.data);
		}
		return Promise.resolve(r);
	});
