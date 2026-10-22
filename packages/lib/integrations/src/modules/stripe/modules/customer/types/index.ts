// ============================================================================
// Customer Module - Domain Types
// ============================================================================

import type { Result } from "#shared/types/result-either";
import type { Customer } from "../domain/models";

// Re-export domain models
export type { Customer };

// Create Customer Request
export interface CreateCustomerRequest {
	readonly email: string;
	readonly name?: string;
	readonly phone?: string;
	readonly description?: string;
	readonly metadata?: Record<string, string>;
}

// Update Customer Request
export interface UpdateCustomerRequest {
	readonly customerId: string;
	readonly name?: string;
	readonly phone?: string;
	readonly description?: string;
	readonly metadata?: Record<string, string>;
	[key: string]: unknown;
}

// Customer Filters
export interface CustomerFilters {
	readonly email?: string;
	readonly name?: string;
	readonly limit?: number;
	readonly offset?: number;
}

// Validation
export type ValidationResult = Result<unknown, Error>;
