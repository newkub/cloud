// ============================================================================
// Shared Kernel - Error Constructors
// ============================================================================

import type {
	AuthorizationError,
	BusinessRuleError,
	ConflictError,
	DatabaseError,
	ExternalServiceError,
	NetworkError,
	NotFoundError,
	ValidationError,
} from "./error-types";

// Domain Error Constructors
export const createValidationError = (
	field: string,
	value: unknown,
	message: string,
): ValidationError => {
	const error = new Error(message) as ValidationError;
	error.type = "ValidationError";
	error.field = field;
	error.value = value;
	return error;
};

export const createNotFoundError = (
	resource: string,
	id: string,
): NotFoundError => {
	const error = new Error(
		`${resource} with id ${id} not found`,
	) as NotFoundError;
	error.type = "NotFoundError";
	error.resource = resource;
	error.id = id;
	return error;
};

export const createConflictError = (
	resource: string,
	details: string,
): ConflictError => {
	const error = new Error(
		`Conflict in ${resource}: ${details}`,
	) as ConflictError;
	error.type = "ConflictError";
	error.resource = resource;
	error.details = details;
	return error;
};

export const createAuthorizationError = (
	operation: string,
): AuthorizationError => {
	const error = new Error(
		`Unauthorized to perform operation: ${operation}`,
	) as AuthorizationError;
	error.type = "AuthorizationError";
	error.operation = operation;
	return error;
};

export const createBusinessRuleError = (
	rule: string,
	message: string,
	context: Record<string, unknown>,
): BusinessRuleError => {
	const error = new Error(message) as BusinessRuleError;
	error.type = "BusinessRuleError";
	error.rule = rule;
	error.context = context;
	return error;
};

// Infrastructure Error Constructors
export const createNetworkError = (
	url: string,
	status?: number,
	message?: string,
): NetworkError => {
	const error = new Error(
		message || `Network error for ${url}`,
	) as NetworkError;
	error.type = "NetworkError";
	error.url = url;
	error.status = status;
	return error;
};

export const createDatabaseError = (
	query: string,
	table: string,
	message?: string,
): DatabaseError => {
	const error = new Error(
		message || `Database error in table ${table}`,
	) as DatabaseError;
	error.type = "DatabaseError";
	error.query = query;
	error.table = table;
	return error;
};

export const createExternalServiceError = (
	service: string,
	endpoint: string,
	message?: string,
): ExternalServiceError => {
	const error = new Error(
		message || `External service error: ${service}`,
	) as ExternalServiceError;
	error.type = "ExternalServiceError";
	error.service = service;
	error.endpoint = endpoint;
	return error;
};
