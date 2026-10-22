/**
 * Base Error Types
 */

// Base error interface
export interface BaseError extends Error {
	readonly _tag: string;
	readonly code: string;
	readonly type: "DOMAIN" | "APPLICATION" | "INFRASTRUCTURE" | "VALIDATION";
	readonly message: string;
	readonly timestamp: number;
	readonly context?: Record<string, unknown>;
}

// Error type constructors helper
export const createError = <T extends BaseError>(
	_tag: T["_tag"],
	code: T["code"],
	type: T["type"],
	message: string,
	context?: Record<string, unknown>,
): Omit<T, "_tag" | "code" | "type" | "message" | "timestamp"> & BaseError =>
	({
		_tag,
		code,
		type,
		message,
		timestamp: Date.now(),
		context,
	}) as T;
