// ============================================================================
// Shared Kernel - Error Type Guards
// ============================================================================

import type {
	AppError,
	AuthorizationError,
	BusinessRuleError,
	ConflictError,
	DatabaseError,
	DomainError,
	ExternalServiceError,
	InfrastructureError,
	NetworkError,
	NotFoundError,
	ValidationError,
} from "./error-types";

// Domain Error Guards
export const isValidationError = (error: AppError): error is ValidationError =>
	error.type === "ValidationError";

export const isNotFoundError = (error: AppError): error is NotFoundError =>
	error.type === "NotFoundError";

export const isConflictError = (error: AppError): error is ConflictError =>
	error.type === "ConflictError";

export const isAuthorizationError = (
	error: AppError,
): error is AuthorizationError => error.type === "AuthorizationError";

export const isBusinessRuleError = (
	error: AppError,
): error is BusinessRuleError => error.type === "BusinessRuleError";

export const isDomainError = (error: AppError): error is DomainError =>
	isValidationError(error) ||
	isNotFoundError(error) ||
	isConflictError(error) ||
	isAuthorizationError(error) ||
	isBusinessRuleError(error);

// Infrastructure Error Guards
export const isNetworkError = (error: AppError): error is NetworkError =>
	error.type === "NetworkError";

export const isDatabaseError = (error: AppError): error is DatabaseError =>
	error.type === "DatabaseError";

export const isExternalServiceError = (
	error: AppError,
): error is ExternalServiceError => error.type === "ExternalServiceError";

export const isInfrastructureError = (
	error: AppError,
): error is InfrastructureError =>
	isNetworkError(error) ||
	isDatabaseError(error) ||
	isExternalServiceError(error);
