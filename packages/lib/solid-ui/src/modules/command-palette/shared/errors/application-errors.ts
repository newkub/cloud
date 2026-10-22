/**
 * Application Errors
 */

import type { BaseError } from "./base-error";
import { createError } from "./base-error";

export interface UseCaseError extends BaseError {
	readonly _tag: "UseCaseError";
	readonly code: "USE_CASE_ERROR";
	readonly type: "APPLICATION";
	readonly useCase: string;
	readonly cause?: string;
}

export const UseCaseError = (
	useCase: string,
	message: string,
	cause?: Error,
	context?: Record<string, unknown>,
): UseCaseError =>
	({
		...createError(
			"UseCaseError",
			"USE_CASE_ERROR",
			"APPLICATION",
			`Use case "${useCase}" failed: ${message}`,
			context,
		),
		useCase,
		cause: cause?.message,
	}) as UseCaseError;

export interface ValidationError extends BaseError {
	readonly _tag: "ValidationError";
	readonly code: "VALIDATION_ERROR";
	readonly type: "APPLICATION";
	readonly field: string;
}

export const ValidationError = (field: string, message: string, context?: Record<string, unknown>): ValidationError =>
	({
		...createError(
			"ValidationError",
			"VALIDATION_ERROR",
			"APPLICATION",
			`Validation failed for field "${field}": ${message}`,
			context,
		),
		field,
	}) as ValidationError;

export interface AuthorizationError extends BaseError {
	readonly _tag: "AuthorizationError";
	readonly code: "AUTHORIZATION_ERROR";
	readonly type: "APPLICATION";
	readonly action: string;
}

export const AuthorizationError = (action: string, context?: Record<string, unknown>): AuthorizationError =>
	({
		...createError(
			"AuthorizationError",
			"AUTHORIZATION_ERROR",
			"APPLICATION",
			`Not authorized to perform action: ${action}`,
			context,
		),
		action,
	}) as AuthorizationError;
