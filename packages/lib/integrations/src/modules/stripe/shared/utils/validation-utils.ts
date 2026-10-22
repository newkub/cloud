// ============================================================================
// Shared Kernel - Validation Utilities
// ============================================================================

import type { Result } from "../types/result-either";
import { failure, isFailure, isSuccess, success } from "../types/result-either";

// Pure Functions

const applyValidators = <T, E extends Error>(
	values: readonly T[],
	validators: readonly ((value: T) => Result<T, E>)[],
): Result<T, E>[] => {
	return values.map((value, index) => validators[index](value) as Result<T, E>);
};

const extractFirstError = <E extends Error>(
	failures: Result<unknown, E>[],
): E => {
	const firstFailure = failures.find(isFailure);
	if (!firstFailure) {
		throw new Error("No failure found");
	}
	return firstFailure.error;
};

const extractValidData = <T>(results: Result<T, unknown>[]): readonly T[] => {
	return results.filter(isSuccess).map((r) => r.data);
};

// Validation Orchestration

export const validateAll = <T, E extends Error>(
	values: readonly T[],
	validators: readonly ((value: T) => Result<T, E>)[],
): Result<readonly T[], E> => {
	const results = applyValidators(values, validators);
	const failures = results.filter(isFailure);

	if (failures.length > 0) {
		return failure(extractFirstError(failures));
	}

	const validData = extractValidData(results);
	return success(validData as readonly T[]) as Result<readonly T[], E>;
};

export const validateAny = <T, E extends Error>(
	values: readonly T[],
	validators: readonly ((value: T) => Result<T, E>)[],
): Result<T, E> => {
	for (let i = 0; i < values.length; i++) {
		const result = validators[i](values[i]);
		if (isSuccess(result)) {
			return result;
		}
	}
	return failure(new Error("No validation passed") as E);
};
