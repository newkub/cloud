// ============================================================================
// Shared Kernel - Option Helper Functions
// ============================================================================

import type { Option, Result } from "./result-either";
import { failure, isSuccess, success } from "./result-either";

export const some = <T>(value: T): Option<T> => ({
	_tag: "Some",
	value,
});

export const none = (): Option<never> => ({
	_tag: "None",
});

export const fromNullable = <T>(value: T | null | undefined): Option<T> =>
	value === null || value === undefined ? none() : some(value);

export const isSome = <T>(
	option: Option<T>,
): option is { _tag: "Some"; value: T } => option._tag === "Some";

export const isNone = <T>(option: Option<T>): option is { _tag: "None" } =>
	option._tag === "None";

export const mapOption = <T, U>(
	option: Option<T>,
	fn: (value: T) => U,
): Option<U> => (isSome(option) ? some(fn(option.value)) : none());

export const flatMapOption = <T, U>(
	option: Option<T>,
	fn: (value: T) => Option<U>,
): Option<U> => (isSome(option) ? fn(option.value) : none());

export const optionToResult = <T, E extends Error>(
	option: Option<T>,
	error: E,
): Result<T, E> => {
	if (isSome(option)) {
		return success(option.value) as Result<T, E>;
	}
	return failure(error) as Result<T, E>;
};

export const resultToOption = <T, E>(result: Result<T, E>): Option<T> => {
	if (isSuccess(result)) {
		return some(result.data);
	}
	return none();
};
