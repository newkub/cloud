// ============================================================================
// Shared Kernel - Error Formatters
// ============================================================================

import type {
	AppError,
	AuthorizationError,
	BusinessRuleError,
	ConflictError,
	DatabaseError,
	ExternalServiceError,
	NetworkError,
	NotFoundError,
	ValidationError,
} from "./error-types";

// Domain Error Formatters
export const formatValidationError = (error: ValidationError): string =>
	`Validation failed for field '${error.field}': ${error.message}`;

export const formatNotFoundError = (error: NotFoundError): string =>
	`${error.resource} with id '${error.id}' not found`;

export const formatConflictError = (error: ConflictError): string =>
	`Conflict in ${error.resource}: ${error.details}`;

export const formatAuthorizationError = (error: AuthorizationError): string =>
	`Unauthorized: ${error.message}`;

export const formatBusinessRuleError = (error: BusinessRuleError): string =>
	`Business rule '${error.rule}' violated: ${error.message}`;

// Infrastructure Error Formatters
export const formatNetworkError = (error: NetworkError): string =>
	`Network error for ${error.url}${error.status ? ` (status: ${error.status})` : ""}`;

export const formatDatabaseError = (error: DatabaseError): string =>
	`Database error in table ${error.table}`;

export const formatExternalServiceError = (
	error: ExternalServiceError,
): string => `External service error: ${error.service}`;

// User-Friendly Formatters
export const formatErrorForUser = (error: AppError): string => {
	if (error.type === "ValidationError") {
		return `Invalid input: ${error.message}`;
	}
	if (error.type === "NotFoundError") {
		return "Resource not found";
	}
	if (error.type === "ConflictError") {
		return "Conflict detected";
	}
	if (error.type === "AuthorizationError") {
		return "You don't have permission to perform this action";
	}
	if (error.type === "BusinessRuleError") {
		return error.message;
	}
	if (error.type === "NetworkError") {
		return "Network error occurred. Please try again.";
	}
	if (error.type === "DatabaseError") {
		return "Database error occurred. Please try again.";
	}
	if (error.type === "ExternalServiceError") {
		return "External service error occurred. Please try again.";
	}
	return "An unexpected error occurred";
};
