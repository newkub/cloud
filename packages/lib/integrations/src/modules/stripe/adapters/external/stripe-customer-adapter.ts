// ============================================================================
// Adapters - External - Stripe Customer Adapter (Pure Functions)
// ============================================================================

import Stripe from "stripe";
import type { Customer } from "#modules/customer/domain/models";
import { STRIPE_API_VERSION } from "#shared/constants";
import type { AsyncResult } from "#shared/types/result-either";
import { asyncFailure, asyncSuccess } from "#shared/types/result-helpers";

// ============================================================================
// Stripe Client Helper
// ============================================================================

function getStripeClient(): Stripe {
	const secretKey = process.env.STRIPE_SECRET_KEY;

	if (!secretKey) {
		throw new Error(
			"STRIPE_SECRET_KEY environment variable is not set. Please set it in your .env file.",
		);
	}

	return new Stripe(secretKey, {
		apiVersion: STRIPE_API_VERSION,
	});
}

// ============================================================================
// Mapping Functions (Pure)
// ============================================================================

function mapStripeCustomerToCustomer(
	stripeCustomer: Stripe.Customer,
	now: number = Date.now(),
): Customer {
	return {
		id: stripeCustomer.id,
		email: stripeCustomer.email || "",
		name: stripeCustomer.name || undefined,
		phone: stripeCustomer.phone || undefined,
		description: stripeCustomer.description || undefined,
		metadata: stripeCustomer.metadata || undefined,
		createdAt: new Date(stripeCustomer.created * 1000),
		updatedAt: new Date(now),
	};
}

// ============================================================================
// Stripe Customer Adapter Functions
// ============================================================================

export async function createCustomer(params: {
	email: string;
	name?: string;
	phone?: string;
	description?: string;
	metadata?: Record<string, string>;
}): AsyncResult<Customer, Error> {
	try {
		const stripe = getStripeClient();
		const stripeCustomer = await stripe.customers.create({
			email: params.email,
			name: params.name,
			phone: params.phone,
			description: params.description,
			metadata: params.metadata,
		});

		return asyncSuccess(mapStripeCustomerToCustomer(stripeCustomer));
	} catch (error) {
		return asyncFailure(
			new Error(
				`Failed to create customer: ${error instanceof Error ? error.message : "Unknown error"}`,
			),
		);
	}
}

export async function updateCustomer(
	customerId: string,
	updates: Record<string, unknown>,
): AsyncResult<Customer, Error> {
	try {
		const stripe = getStripeClient();
		const stripeCustomer = await stripe.customers.update(customerId, {
			name: updates.name as string | undefined,
			phone: updates.phone as string | undefined,
			description: updates.description as string | undefined,
			metadata: updates.metadata as Record<string, string> | undefined,
		});

		return asyncSuccess(mapStripeCustomerToCustomer(stripeCustomer));
	} catch (error) {
		return asyncFailure(
			new Error(
				`Failed to update customer: ${error instanceof Error ? error.message : "Unknown error"}`,
			),
		);
	}
}

export async function retrieveCustomer(
	customerId: string,
): AsyncResult<Customer, Error> {
	try {
		const stripe = getStripeClient();
		const stripeCustomer = await stripe.customers.retrieve(customerId);

		if (stripeCustomer.deleted) {
			return asyncFailure(new Error("Customer has been deleted"));
		}

		return asyncSuccess(mapStripeCustomerToCustomer(stripeCustomer));
	} catch (error) {
		return asyncFailure(
			new Error(
				`Failed to retrieve customer: ${error instanceof Error ? error.message : "Unknown error"}`,
			),
		);
	}
}

export async function deleteCustomer(
	customerId: string,
): AsyncResult<void, Error> {
	try {
		const stripe = getStripeClient();
		await stripe.customers.del(customerId);
		return asyncSuccess(undefined);
	} catch (error) {
		return asyncFailure(
			new Error(
				`Failed to delete customer: ${error instanceof Error ? error.message : "Unknown error"}`,
			),
		);
	}
}

export async function listCustomers(params?: {
	email?: string;
	limit?: number;
}): AsyncResult<readonly Customer[], Error> {
	try {
		const stripe = getStripeClient();
		const stripeCustomers = await stripe.customers.list({
			email: params?.email,
			limit: params?.limit,
		});

		const customers: readonly Customer[] = stripeCustomers.data.map(
			mapStripeCustomerToCustomer,
		);

		return asyncSuccess(customers);
	} catch (error) {
		return asyncFailure(
			new Error(
				`Failed to list customers: ${error instanceof Error ? error.message : "Unknown error"}`,
			),
		);
	}
}

// ============================================================================
// Stripe Customer Adapter (Exported Object)
// ============================================================================

export const stripeCustomerAdapter = {
	createCustomer,
	updateCustomer,
	retrieveCustomer,
	deleteCustomer,
	listCustomers,
};
