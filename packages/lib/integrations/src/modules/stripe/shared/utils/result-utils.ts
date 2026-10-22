// ============================================================================
// Shared Kernel - Result Chaining Utilities
// ============================================================================

import type { Result } from "../types/result-either";
import { isSuccess } from "../types/result-either";

export const chain = <T, U, E>(
	result: Result<T, E>,
	fn: (value: T) => Result<U, E>,
): Result<U, E> => {
	if (isSuccess(result)) {
		return fn(result.data);
	}
	return result as unknown as Result<U, E>;
};

export const chainAsync = <T, U, E>(
	result: Result<T, E>,
	fn: (value: T) => Promise<Result<U, E>>,
): Promise<Result<U, E>> => {
	if (isSuccess(result)) {
		return fn(result.data);
	}
	return Promise.resolve(result as unknown as Result<U, E>);
};
