/**
 * Shared error types used across the animation library - Functional Programming
 */

// Base error interface
export interface BaseError {
	readonly _tag: string;
	readonly code: string;
	readonly category: "validation" | "performance" | "configuration" | "domain";
	readonly message: string;
	readonly timestamp?: number;
	readonly context?: Record<string, unknown>;
}

// Error constructor helper
const createError = <T extends BaseError>(
	_tag: T["_tag"],
	code: T["code"],
	category: T["category"],
	message: string,
	context?: Record<string, unknown>,
): Omit<T, "_tag" | "code" | "category" | "message" | "timestamp"> & BaseError =>
	({
		_tag,
		code,
		category,
		message,
		context,
	}) as T;

// Validation errors
export interface ValidationError extends BaseError {
	readonly _tag: "ValidationError";
	readonly code: "VALIDATION_ERROR";
	readonly category: "validation";
	readonly field?: string;
}

export const createValidationError = (
	message: string,
	field?: string,
	context?: Record<string, unknown>,
): ValidationError =>
	({
		...createError("ValidationError", "VALIDATION_ERROR", "validation", message, context),
		field,
	}) as ValidationError;

// Performance errors
export interface PerformanceError extends BaseError {
	readonly _tag: "PerformanceError";
	readonly code: "PERFORMANCE_ERROR";
	readonly category: "performance";
}

export const createPerformanceError = (message: string, context?: Record<string, unknown>): PerformanceError =>
	({
		...createError("PerformanceError", "PERFORMANCE_ERROR", "performance", message, context),
	}) as PerformanceError;

// Configuration errors
export interface ConfigurationError extends BaseError {
	readonly _tag: "ConfigurationError";
	readonly code: "CONFIGURATION_ERROR";
	readonly category: "configuration";
}

export const createConfigurationError = (message: string, context?: Record<string, unknown>): ConfigurationError =>
	({
		...createError("ConfigurationError", "CONFIGURATION_ERROR", "configuration", message, context),
	}) as ConfigurationError;

// Type guards
export const isValidationError = (error: BaseError): error is ValidationError => error._tag === "ValidationError";

export const isPerformanceError = (error: BaseError): error is PerformanceError => error._tag === "PerformanceError";

export const isConfigurationError = (error: BaseError): error is ConfigurationError =>
	error._tag === "ConfigurationError";

// Union type for all animation errors
export type AnimationError = ValidationError | PerformanceError | ConfigurationError;
