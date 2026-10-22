// ============================================================================
// Shared Kernel - Error Type Definitions
// ============================================================================

// Base Error Types
export type DomainError =
	| ValidationError
	| NotFoundError
	| ConflictError
	| AuthorizationError
	| BusinessRuleError;

export type InfrastructureError =
	| NetworkError
	| DatabaseError
	| ExternalServiceError;

export type AppError = DomainError | InfrastructureError;

// Domain Error Types
export interface ValidationError extends Error {
	type: "ValidationError";
	field: string;
	value: unknown;
}

export interface NotFoundError extends Error {
	type: "NotFoundError";
	resource: string;
	id: string;
}

export interface ConflictError extends Error {
	type: "ConflictError";
	resource: string;
	details: string;
}

export interface AuthorizationError extends Error {
	type: "AuthorizationError";
	operation: string;
}

export interface BusinessRuleError extends Error {
	type: "BusinessRuleError";
	rule: string;
	context: Record<string, unknown>;
}

// Infrastructure Error Types
export interface NetworkError extends Error {
	type: "NetworkError";
	url: string;
	status?: number;
}

export interface DatabaseError extends Error {
	type: "DatabaseError";
	query: string;
	table: string;
}

export interface ExternalServiceError extends Error {
	type: "ExternalServiceError";
	service: string;
	endpoint: string;
}
