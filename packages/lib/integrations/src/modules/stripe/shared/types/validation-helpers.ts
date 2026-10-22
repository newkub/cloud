// ============================================================================
// Shared Kernel - Validation Utilities
// ============================================================================

import type { AsyncResult, Result } from "./result-either";
import { failure, success } from "./result-either";

export const validate = <T, E extends Error>(
	value: T,
	predicate: (value: T) => boolean,
	error: E,
): Result<T, E> => {
	if (predicate(value)) {
		return success(value) as Result<T, E>;
	}
	return failure(error);
};

export const validateAsync = <T, E extends Error>(
	value: T,
	predicate: (value: T) => Promise<boolean>,
	error: E,
): AsyncResult<T, E> =>
	predicate(value).then((isValid) => {
		if (isValid) {
			return success(value) as Result<T, E>;
		}
		return failure(error);
	});
