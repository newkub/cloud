// ============================================================================
// Infrastructure - Customer Adapter (Pure Functions)
// ============================================================================

import type {
	Customer,
	CustomerFilters,
} from "#modules/customer/ports/customer-repository";
import type { AsyncResult } from "#shared/types/result-either";
import { asyncFailure, asyncSuccess } from "#shared/types/result-helpers";
import { customerRepository } from "./db/repositories/customer-repository";
import type { CustomerSchema } from "./db/repositories/schema/customers";
import { stripeCustomerAdapter } from "./external/stripe-customer-adapter";

// ============================================================================
// Mapping Functions (Pure)
// ============================================================================

function mapToCustomer(schema: CustomerSchema): Customer {
	return {
		id: schema.id.toString(),
		email: schema.email,
		name: schema.name ?? undefined,
		phone: schema.phone ?? undefined,
		description: schema.description ?? undefined,
		metadata: schema.metadata
			? (JSON.parse(schema.metadata) as Record<string, string>)
			: undefined,
		createdAt: schema.createdAt,
		updatedAt: schema.updatedAt,
	};
}

// ============================================================================
// Customer Repository Adapter Functions
// ============================================================================

export async function createCustomer(params: {
	email: string;
	name?: string;
	phone?: string;
	description?: string;
	metadata?: Record<string, string>;
}): AsyncResult<Customer, Error> {
	try {
		// First create in Stripe
		const stripeResult = await stripeCustomerAdapter.createCustomer(params);
		if (!stripeResult.success) {
			return asyncFailure(new Error("Failed to create customer in Stripe"));
		}

		const stripeCustomer = stripeResult.data;

		// Then save to database
		const dbResult = await customerRepository.create({
			stripeCustomerId: stripeCustomer.id,
			email: params.email,
			name: params.name,
			phone: params.phone,
			description: params.description,
			metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
		});

		if (!dbResult.success) {
			return asyncFailure(dbResult.error);
		}

		return asyncSuccess({
			id: dbResult.data.id.toString(),
			email: dbResult.data.email,
			name: dbResult.data.name ?? undefined,
			phone: dbResult.data.phone ?? undefined,
			description: dbResult.data.description ?? undefined,
			metadata: dbResult.data.metadata
				? (JSON.parse(dbResult.data.metadata) as Record<string, string>)
				: undefined,
			createdAt: dbResult.data.createdAt,
			updatedAt: dbResult.data.updatedAt,
		});
	} catch (error) {
		return asyncFailure(error as Error);
	}
}

export async function getCustomer(
	customerId: string,
): AsyncResult<Customer, Error> {
	try {
		const dbResult = await customerRepository.findById(
			Number.parseInt(customerId, 10),
		);
		if (!dbResult.success) {
			return asyncFailure(dbResult.error);
		}

		if (!dbResult.data) {
			return asyncFailure(new Error("Customer not found"));
		}

		return asyncSuccess(mapToCustomer(dbResult.data));
	} catch (error) {
		return asyncFailure(error as Error);
	}
}

export async function getCustomers(
	filters?: CustomerFilters,
): AsyncResult<readonly Customer[], Error> {
	try {
		const dbResult = await customerRepository.findAll(filters);
		if (!dbResult.success) {
			return asyncFailure(dbResult.error);
		}

		const customers = dbResult.data.map(mapToCustomer);
		return asyncSuccess(customers);
	} catch (error) {
		return asyncFailure(error as Error);
	}
}

export async function updateCustomer(
	customerId: string,
	updates: Record<string, unknown>,
): AsyncResult<Customer, Error> {
	try {
		// Update in Stripe first
		const stripeResult = await stripeCustomerAdapter.updateCustomer(
			customerId,
			updates,
		);
		if (!stripeResult.success) {
			return asyncFailure(new Error("Failed to update customer in Stripe"));
		}

		// Then update in database
		const dbResult = await customerRepository.update(
			Number.parseInt(customerId, 10),
			{
				name: updates.name as string | undefined,
				phone: updates.phone as string | undefined,
				description: updates.description as string | undefined,
				metadata: updates.metadata
					? JSON.stringify(updates.metadata)
					: undefined,
			},
		);

		if (!dbResult.success) {
			return asyncFailure(dbResult.error);
		}

		return asyncSuccess(mapToCustomer(dbResult.data));
	} catch (error) {
		return asyncFailure(error as Error);
	}
}

export async function deleteCustomer(
	customerId: string,
): AsyncResult<void, Error> {
	try {
		// Delete from Stripe first
		const stripeResult = await stripeCustomerAdapter.deleteCustomer(customerId);
		if (!stripeResult.success) {
			return asyncFailure(new Error("Failed to delete customer in Stripe"));
		}

		// Then soft delete from database
		const dbResult = await customerRepository.delete(
			Number.parseInt(customerId, 10),
		);

		if (!dbResult.success) {
			return asyncFailure(dbResult.error);
		}

		return asyncSuccess(undefined);
	} catch (error) {
		return asyncFailure(error as Error);
	}
}

export async function getCustomerByEmail(
	email: string,
): AsyncResult<Customer, Error> {
	try {
		const dbResult = await customerRepository.findByEmail(email);
		if (!dbResult.success) {
			return asyncFailure(dbResult.error);
		}

		if (!dbResult.data) {
			return asyncFailure(new Error("Customer not found"));
		}

		return asyncSuccess(mapToCustomer(dbResult.data));
	} catch (error) {
		return asyncFailure(error as Error);
	}
}

// ============================================================================
// Customer Adapter (Repository Implementation)
// ============================================================================

export const customerAdapter = {
	createCustomer,
	getCustomer,
	getCustomers,
	updateCustomer,
	deleteCustomer,
	getCustomerByEmail,
};
