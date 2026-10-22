// Shared types for functional programming patterns

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export type Option<T> = { some: true; value: T } | { some: false };

export type Either<L, R> = { left: true; value: L } | { left: false; value: R };

// Type guards
export const isSuccess = <T, E>(result: Result<T, E>): result is { success: true; data: T } => result.success;

export const isFailure = <T, E>(result: Result<T, E>): result is { success: false; error: E } => !result.success;

export const isSome = <T>(option: Option<T>): option is { some: true; value: T } => option.some;

export const isNone = <T>(option: Option<T>): option is { some: false } => !option.some;

export const isLeft = <L, R>(either: Either<L, R>): either is { left: true; value: L } => either.left;

export const isRight = <L, R>(either: Either<L, R>): either is { left: false; value: R } => !either.left;

// Constructors
export const success = <T>(data: T): Result<T> => ({ success: true, data });
export const failure = <E>(error: E): Result<never, E> => ({
	success: false,
	error,
});
export const some = <T>(value: T): Option<T> => ({ some: true, value });
export const none = (): Option<never> => ({ some: false });
export const left = <L>(value: L): Either<L, never> => ({ left: true, value });
export const right = <R>(value: R): Either<never, R> => ({
	left: false,
	value,
});
