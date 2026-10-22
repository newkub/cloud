// Error types for chart domain - Functional Programming

// Base error interface
export interface BaseError {
	readonly _tag: string;
	readonly code: string;
	readonly category: "validation" | "calculation" | "rendering" | "infrastructure";
	readonly message: string;
	readonly timestamp: number;
	readonly context?: Record<string, unknown>;
	readonly cause?: string;
}

// Error constructor helper
const createError = <T extends BaseError>(
	_tag: T["_tag"],
	code: T["code"],
	category: T["category"],
	message: string,
	context?: Record<string, unknown>,
	cause?: Error,
	now: number = Date.now(),
): Omit<T, "_tag" | "code" | "category" | "message" | "timestamp"> & BaseError =>
	({
		_tag,
		code,
		category,
		message,
		timestamp: now,
		context,
		cause: cause?.message,
	}) as T;

// Validation errors
export interface ValidationError extends BaseError {
	readonly _tag: "ValidationError";
	readonly code: "VALIDATION_ERROR";
	readonly category: "validation";
	readonly field?: string;
}

export const ValidationError = (message: string, field?: string, context?: Record<string, unknown>): ValidationError =>
	({
		...createError(
			"ValidationError",
			"VALIDATION_ERROR",
			"validation",
			field ? `${field}: ${message}` : message,
			context,
		),
		field,
	}) as ValidationError;

// Calculation errors
export interface CalculationError extends BaseError {
	readonly _tag: "CalculationError";
	readonly code: "CALCULATION_ERROR";
	readonly category: "calculation";
	readonly operation?: string;
}

export const CalculationError = (
	message: string,
	operation?: string,
	context?: Record<string, unknown>,
): CalculationError =>
	({
		...createError(
			"CalculationError",
			"CALCULATION_ERROR",
			"calculation",
			operation ? `Calculation error in ${operation}: ${message}` : message,
			context,
		),
		operation,
	}) as CalculationError;

// Rendering errors
export interface RenderingError extends BaseError {
	readonly _tag: "RenderingError";
	readonly code: "RENDERING_ERROR";
	readonly category: "rendering";
	readonly renderer?: string;
}

export const RenderingError = (message: string, renderer?: string, context?: Record<string, unknown>): RenderingError =>
	({
		...createError(
			"RenderingError",
			"RENDERING_ERROR",
			"rendering",
			renderer ? `Rendering error in ${renderer}: ${message}` : message,
			context,
		),
		renderer,
	}) as RenderingError;

// Infrastructure errors
export interface InfrastructureError extends BaseError {
	readonly _tag: "InfrastructureError";
	readonly code: "INFRASTRUCTURE_ERROR";
	readonly category: "infrastructure";
	readonly component?: string;
}

export const InfrastructureError = (
	message: string,
	component?: string,
	context?: Record<string, unknown>,
): InfrastructureError =>
	({
		...createError(
			"InfrastructureError",
			"INFRASTRUCTURE_ERROR",
			"infrastructure",
			component ? `Infrastructure error in ${component}: ${message}` : message,
			context,
		),
		component,
	}) as InfrastructureError;

// Error factory functions (FP style)
export const createValidationError = ValidationError;
export const createCalculationError = CalculationError;
export const createRenderingError = RenderingError;
export const createInfrastructureError = InfrastructureError;

// Type guards
export const isValidationError = (error: BaseError): error is ValidationError => error._tag === "ValidationError";

export const isCalculationError = (error: BaseError): error is CalculationError => error._tag === "CalculationError";

export const isRenderingError = (error: BaseError): error is RenderingError => error._tag === "RenderingError";

export const isInfrastructureError = (error: BaseError): error is InfrastructureError =>
	error._tag === "InfrastructureError";

// Union type for all chart errors
export type ChartError = ValidationError | CalculationError | RenderingError | InfrastructureError;
