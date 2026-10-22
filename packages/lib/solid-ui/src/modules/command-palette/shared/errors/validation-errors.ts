/**
 * Validation Errors
 */

import type { BaseError } from "./base-error";
import { createError } from "./base-error";

export interface RequiredFieldError extends BaseError {
	readonly _tag: "RequiredFieldError";
	readonly code: "REQUIRED_FIELD";
	readonly type: "VALIDATION";
	readonly field: string;
}

export const RequiredFieldError = (field: string, context?: Record<string, unknown>): RequiredFieldError =>
	({
		...createError("RequiredFieldError", "REQUIRED_FIELD", "VALIDATION", `Field "${field}" is required`, context),
		field,
	}) as RequiredFieldError;

export interface InvalidFormatError extends BaseError {
	readonly _tag: "InvalidFormatError";
	readonly code: "INVALID_FORMAT";
	readonly type: "VALIDATION";
	readonly field: string;
	readonly expectedFormat: string;
}

export const InvalidFormatError = (
	field: string,
	expectedFormat: string,
	context?: Record<string, unknown>,
): InvalidFormatError =>
	({
		...createError(
			"InvalidFormatError",
			"INVALID_FORMAT",
			"VALIDATION",
			`Field "${field}" must be in ${expectedFormat} format`,
			context,
		),
		field,
		expectedFormat,
	}) as InvalidFormatError;

export interface InvalidLengthError extends BaseError {
	readonly _tag: "InvalidLengthError";
	readonly code: "INVALID_LENGTH";
	readonly type: "VALIDATION";
	readonly field: string;
	readonly min?: number;
	readonly max?: number;
}

export const InvalidLengthError = (
	field: string,
	min?: number,
	max?: number,
	context?: Record<string, unknown>,
): InvalidLengthError => {
	const range =
		min !== undefined && max !== undefined
			? `between ${min} and ${max}`
			: min !== undefined
				? `at least ${min}`
				: `at most ${max}`;
	return {
		...createError(
			"InvalidLengthError",
			"INVALID_LENGTH",
			"VALIDATION",
			`Field "${field}" length must be ${range} characters`,
			context,
		),
		field,
		min,
		max,
	} as InvalidLengthError;
};
