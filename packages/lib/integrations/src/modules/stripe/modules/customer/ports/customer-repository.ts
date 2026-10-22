// ============================================================================
// Customer Module - Ports (Interfaces)
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import type { Customer, CustomerFilters } from "../types";

// Re-export types for external use
export type { Customer, CustomerFilters } from "../types";

// Repository Port
export interface CustomerRepository {
	createCustomer(params: {
		email: string;
		name?: string;
		phone?: string;
		description?: string;
		metadata?: Record<string, string>;
	}): AsyncResult<Customer, Error>;
	getCustomer(customerId: string): AsyncResult<Customer, Error>;
	getCustomers(
		filters?: CustomerFilters,
	): AsyncResult<readonly Customer[], Error>;
	updateCustomer(
		customerId: string,
		updates: Record<string, unknown>,
	): AsyncResult<Customer, Error>;
	deleteCustomer(customerId: string): AsyncResult<void, Error>;
	getCustomerByEmail(email: string): AsyncResult<Customer, Error>;
}

// Event Publisher Port
export interface CustomerEventPublisher {
	publish(event: {
		eventType: string;
		[key: string]: unknown;
	}): AsyncResult<void, Error>;
}

// Stripe Adapter Port
export interface StripeCustomerAdapter {
	createCustomer(params: {
		email: string;
		name?: string;
		phone?: string;
		description?: string;
		metadata?: Record<string, string>;
	}): AsyncResult<Customer, Error>;
	updateCustomer(
		customerId: string,
		updates: Record<string, unknown>,
	): AsyncResult<Customer, Error>;
	retrieveCustomer(customerId: string): AsyncResult<Customer, Error>;
	deleteCustomer(customerId: string): AsyncResult<void, Error>;
	listCustomers(params?: {
		email?: string;
		limit?: number;
	}): AsyncResult<readonly Customer[], Error>;
}
