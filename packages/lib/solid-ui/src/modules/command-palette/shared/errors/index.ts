/**
 * Shared Errors - Functional Programming Error Types
 */

// Re-export application errors
export {
	AuthorizationError,
	UseCaseError,
	ValidationError,
} from "./application-errors";

// Re-export base types
export type { BaseError, createError } from "./base-error";

// Re-export domain errors
export {
	CommandAlreadyExistsError,
	CommandNotFoundError,
	InvalidCommandActionError,
} from "./domain-errors";

// Re-export infrastructure errors
export {
	ConfigurationError,
	DatabaseError,
	FileSystemError,
	NetworkError,
} from "./infrastructure-errors";

// Re-export type guards
export {
	isApplicationError,
	isDomainError,
	isInfrastructureError,
	isValidationError,
} from "./type-guards";

// Re-export validation errors
export {
	InvalidFormatError,
	InvalidLengthError,
	RequiredFieldError,
} from "./validation-errors";

import type { AuthorizationError, UseCaseError, ValidationError } from "./application-errors";
import type { CommandAlreadyExistsError, CommandNotFoundError, InvalidCommandActionError } from "./domain-errors";
import type { ConfigurationError, DatabaseError, FileSystemError, NetworkError } from "./infrastructure-errors";
import type { InvalidFormatError, InvalidLengthError, RequiredFieldError } from "./validation-errors";

export type CommandPaletteError =
	| CommandNotFoundError
	| CommandAlreadyExistsError
	| InvalidCommandActionError
	| UseCaseError
	| ValidationError
	| AuthorizationError
	| DatabaseError
	| FileSystemError
	| NetworkError
	| ConfigurationError
	| RequiredFieldError
	| InvalidFormatError
	| InvalidLengthError;
