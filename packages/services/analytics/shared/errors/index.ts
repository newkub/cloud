/**
 * Shared Error Types - Public API
 * Functional error types used across the application
 */

import type { DatabaseError } from "./database-error";
import type { NetworkError } from "./network-error";
import type { NotFoundError } from "./not-found-error";
import type { UnauthorizedError } from "./unauthorized-error";
import type { ValidationError } from "./validation-error";

export type { DatabaseError } from "./database-error";
export { DatabaseError as DatabaseErrorFactory } from "./database-error";
export type { NetworkError } from "./network-error";
export { NetworkError as NetworkErrorFactory } from "./network-error";
export type { NotFoundError } from "./not-found-error";
export { NotFoundError as NotFoundErrorFactory } from "./not-found-error";
export type { UnauthorizedError } from "./unauthorized-error";
export { UnauthorizedError as UnauthorizedErrorFactory } from "./unauthorized-error";
export type { ValidationError } from "./validation-error";
export { ValidationError as ValidationErrorFactory } from "./validation-error";

export type AnalyticsError =
	| ValidationError
	| NotFoundError
	| UnauthorizedError
	| DatabaseError
	| NetworkError;
