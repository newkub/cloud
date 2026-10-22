/**
 * Type Guards for Errors
 */

import type { AuthorizationError, UseCaseError, ValidationError } from "./application-errors";
import type { BaseError } from "./base-error";
import type { CommandAlreadyExistsError, CommandNotFoundError, InvalidCommandActionError } from "./domain-errors";
import type { ConfigurationError, DatabaseError, FileSystemError, NetworkError } from "./infrastructure-errors";
import type { InvalidFormatError, InvalidLengthError, RequiredFieldError } from "./validation-errors";

export const isDomainError = (
	error: BaseError,
): error is CommandNotFoundError | CommandAlreadyExistsError | InvalidCommandActionError => error.type === "DOMAIN";

export const isApplicationError = (error: BaseError): error is UseCaseError | ValidationError | AuthorizationError =>
	error.type === "APPLICATION";

export const isInfrastructureError = (
	error: BaseError,
): error is DatabaseError | FileSystemError | NetworkError | ConfigurationError => error.type === "INFRASTRUCTURE";

export const isValidationError = (
	error: BaseError,
): error is RequiredFieldError | InvalidFormatError | InvalidLengthError => error.type === "VALIDATION";
