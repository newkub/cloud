// ============================================================================
// Customer Module - Application Layer - Customer Management
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import {
	createCustomerCreatedEvent,
	createCustomerDeletedEvent,
	createCustomerUpdatedEvent,
} from "../../domain/events/customer-events";
import {
	validateCreateCustomerRequest,
	validateUpdateCustomerRequest,
} from "../../domain/validators/validation";
import type {
	CustomerRepository,
	StripeCustomerAdapter,
} from "../../ports/customer-repository";
import type {
	CreateCustomerRequest,
	Customer,
	UpdateCustomerRequest,
} from "../../types";

// Dependencies
export interface CustomerManagementDependencies {
	readonly repository: CustomerRepository;
	readonly stripeAdapter: StripeCustomerAdapter;
	readonly eventPublisher?: {
		publish(event: unknown): AsyncResult<void, Error>;
	};
}

// Create Customer
export const createCustomer = async (
	request: CreateCustomerRequest,
	dependencies: CustomerManagementDependencies,
): AsyncResult<Customer, Error> => {
	// Validate request
	const validationResult = validateCreateCustomerRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Check if customer with email already exists
	const existingResult = await dependencies.repository.getCustomerByEmail(
		request.email,
	);
	if (existingResult.success) {
		return existingResult;
	}

	// Create customer via Stripe
	const stripeResult = await dependencies.stripeAdapter.createCustomer({
		email: request.email,
		name: request.name,
		phone: request.phone,
		description: request.description,
		metadata: request.metadata,
	});
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Save to repository
	const saveResult = await dependencies.repository.createCustomer({
		email: request.email,
		name: request.name,
		phone: request.phone,
		description: request.description,
		metadata: request.metadata,
	});
	if (!saveResult.success) {
		return saveResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createCustomerCreatedEvent(saveResult.data),
		);
	}

	return saveResult;
};

// Get Customer
export const getCustomer = async (
	customerId: string,
	dependencies: CustomerManagementDependencies,
): AsyncResult<Customer, Error> => {
	return dependencies.repository.getCustomer(customerId);
};

// Get Customers
export const getCustomers = async (
	dependencies: CustomerManagementDependencies,
	filters?: { email?: string; name?: string; limit?: number; offset?: number },
): AsyncResult<readonly Customer[], Error> => {
	return dependencies.repository.getCustomers(filters);
};

// Update Customer
export const updateCustomer = async (
	request: UpdateCustomerRequest,
	dependencies: CustomerManagementDependencies,
): AsyncResult<Customer, Error> => {
	// Validate request
	const validationResult = validateUpdateCustomerRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Update via Stripe
	const stripeResult = await dependencies.stripeAdapter.updateCustomer(
		request.customerId,
		request,
	);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Update in repository
	const updateResult = await dependencies.repository.updateCustomer(
		request.customerId,
		request,
	);
	if (!updateResult.success) {
		return updateResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createCustomerUpdatedEvent(updateResult.data, request),
		);
	}

	return updateResult;
};

// Delete Customer
export const deleteCustomer = async (
	customerId: string,
	dependencies: CustomerManagementDependencies,
): AsyncResult<void, Error> => {
	// Get customer before deletion
	const customerResult = await dependencies.repository.getCustomer(customerId);
	if (!customerResult.success) {
		return customerResult;
	}

	// Delete via Stripe
	const stripeResult =
		await dependencies.stripeAdapter.deleteCustomer(customerId);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Delete from repository
	const deleteResult = await dependencies.repository.deleteCustomer(customerId);
	if (!deleteResult.success) {
		return deleteResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createCustomerDeletedEvent(customerResult.data),
		);
	}

	return deleteResult;
};
