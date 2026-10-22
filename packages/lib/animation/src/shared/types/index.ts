/**
 * Shared types used across the animation library
 */

export type Result<T, E = Error> =
	| { readonly _tag: "Ok"; readonly success: true; readonly data: T }
	| { readonly _tag: "Err"; readonly success: false; readonly error: E };

export type Option<T> = { readonly _tag: "Some"; readonly value: T } | { readonly _tag: "None" };

export type Either<L, R> = { readonly _tag: "Left"; readonly left: L } | { readonly _tag: "Right"; readonly right: R };

// Helper functions for Result type
export const ok = <T>(data: T): Result<T> => ({
	_tag: "Ok",
	success: true,
	data,
});

export const err = <E>(error: E): Result<never, E> =>
	({
		_tag: "Err",
		success: false,
		error,
	}) as Result<never, E>;

// Animation-specific types
export * from "./animation";
export * from "./canvas";
export * from "./draggable";
export * from "./physics";
export * from "./scroll";
export * from "./svg";
export * from "./text";
