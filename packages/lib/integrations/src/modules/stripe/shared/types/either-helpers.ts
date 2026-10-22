// ============================================================================
// Shared Kernel - Either Helper Functions
// ============================================================================

import type { Either, Result } from "./result-either";
import { isSuccess } from "./result-either";

export const left = <L>(value: L): Either<L, never> => ({
	_tag: "Left",
	left: value,
});

export const right = <R>(value: R): Either<never, R> => ({
	_tag: "Right",
	right: value,
});

export const isLeft = <L, R>(
	either: Either<L, R>,
): either is { _tag: "Left"; left: L } => either._tag === "Left";

export const isRight = <L, R>(
	either: Either<L, R>,
): either is { _tag: "Right"; right: R } => either._tag === "Right";

export const mapEither = <L, R, U>(
	either: Either<L, R>,
	fn: (value: R) => U,
): Either<L, U> => {
	if (isRight(either)) {
		return right(fn(either.right));
	}
	return left((either as { _tag: "Left"; left: L }).left);
};

export const resultToEither = <T, E>(result: Result<T, E>): Either<E, T> => {
	if (isSuccess(result)) {
		return right(result.data);
	}
	return left((result as { success: false; error: E }).error);
};

export const flatMapEither = <L, R, U>(
	either: Either<L, R>,
	fn: (value: R) => Either<L, U>,
): Either<L, U> => {
	if (isRight(either)) {
		return fn(either.right);
	}
	return left((either as { _tag: "Left"; left: L }).left);
};

export const eitherToResult = <L, R>(either: Either<L, R>): Result<R, L> => {
	if (isRight(either)) {
		return { success: true, data: either.right };
	}
	return { success: false, error: (either as { _tag: "Left"; left: L }).left };
};
