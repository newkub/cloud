// ============================================================================
// Shared Kernel - Result/Either/Option Monad Types
// ============================================================================

// Result Type for error handling
export type Result<T, E = Error> =
	| { readonly success: true; readonly data: T }
	| { readonly success: false; readonly error: E };

// Helper functions for Result type
export const success = <T, E = Error>(data: T): Result<T, E> => ({
	success: true,
	data,
});

export const failure = <E>(error: E): Result<never, E> => ({
	success: false,
	error,
});

// Type guards
export const isSuccess = <T, E>(
	result: Result<T, E>,
): result is { readonly success: true; readonly data: T } =>
	result.success === true;

export const isFailure = <T, E>(
	result: Result<T, E>,
): result is { readonly success: false; readonly error: E } =>
	result.success === false;

// Result helper functions
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

// Option Type for nullable values
export type Option<T> =
	| { readonly _tag: "Some"; readonly value: T }
	| { readonly _tag: "None" };

// Either Type for error handling
export type Either<L, R> =
	| { readonly _tag: "Left"; readonly left: L }
	| { readonly _tag: "Right"; readonly right: R };

// Helper functions for Either type
export const left = <L>(value: L): Either<L, never> => ({
	_tag: "Left",
	left: value,
});

export const right = <R>(value: R): Either<never, R> => ({
	_tag: "Right",
	right: value,
});

// Type guards for Either
export const isLeft = <L, R>(
	either: Either<L, R>,
): either is { readonly _tag: "Left"; readonly left: L } =>
	either._tag === "Left";

export const isRight = <L, R>(
	either: Either<L, R>,
): either is { readonly _tag: "Right"; readonly right: R } =>
	either._tag === "Right";

// Either helper functions
export const flatMapEither = <L, R, S>(
	either: Either<L, R>,
	fn: (data: R) => Either<L, S>,
): Either<L, S> => {
	if (isRight(either)) {
		return fn(either.right);
	}
	return either;
};

// Async Result Type
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
