// ============================================================================
// Checkout Module - Application Layer - Checkout Management
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import {
	createCheckoutSessionCompletedEvent,
	createCheckoutSessionCreatedEvent,
	createCheckoutSessionExpiredEvent,
} from "../../domain/events/checkout-events";
import { validateCreateCheckoutSessionRequest } from "../../domain/validators/validation";
import type {
	CheckoutSessionRepository,
	StripeCheckoutAdapter,
} from "../../ports/checkout-repository";
import type {
	CheckoutSession,
	CreateCheckoutSessionRequest,
} from "../../types";

// Dependencies
export interface CheckoutManagementDependencies {
	readonly repository: CheckoutSessionRepository;
	readonly stripeAdapter: StripeCheckoutAdapter;
	readonly eventPublisher?: {
		publish(event: unknown): AsyncResult<void, Error>;
	};
}

// Create Checkout Session
export const createCheckoutSession = async (
	request: CreateCheckoutSessionRequest,
	dependencies: CheckoutManagementDependencies,
): AsyncResult<CheckoutSession, Error> => {
	// Validate request
	const validationResult = validateCreateCheckoutSessionRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Create session via Stripe
	const stripeResult = await dependencies.stripeAdapter.createSession({
		line_items: [{ price: request.priceId, quantity: request.quantity || 1 }],
		mode: request.mode || "payment",
		success_url: request.successUrl,
		cancel_url: request.cancelUrl,
		customer: request.customerId,
		customer_email: request.customerEmail,
		metadata: request.metadata,
		allow_promotion_codes: request.allowPromotionCodes,
	});
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Save to repository
	const saveResult = await dependencies.repository.createSession(request);
	if (!saveResult.success) {
		return saveResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createCheckoutSessionCreatedEvent(saveResult.data),
		);
	}

	return saveResult;
};

// Get Checkout Session
export const getCheckoutSession = async (
	sessionId: string,
	dependencies: CheckoutManagementDependencies,
): AsyncResult<CheckoutSession, Error> => {
	return dependencies.repository.getSession(sessionId);
};

// Get Sessions by Customer
export const getSessionsByCustomer = async (
	customerId: string,
	dependencies: CheckoutManagementDependencies,
): AsyncResult<readonly CheckoutSession[], Error> => {
	return dependencies.repository.getSessionsByCustomer(customerId);
};

// Complete Checkout Session
export const completeCheckoutSession = async (
	sessionId: string,
	dependencies: CheckoutManagementDependencies,
): AsyncResult<CheckoutSession, Error> => {
	const sessionResult = await dependencies.repository.getSession(sessionId);
	if (!sessionResult.success) {
		return sessionResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createCheckoutSessionCompletedEvent(sessionResult.data),
		);
	}

	return sessionResult;
};

// Expire Checkout Session
export const expireCheckoutSession = async (
	sessionId: string,
	dependencies: CheckoutManagementDependencies,
): AsyncResult<CheckoutSession, Error> => {
	const stripeResult =
		await dependencies.stripeAdapter.expireSession(sessionId);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createCheckoutSessionExpiredEvent(stripeResult.data),
		);
	}

	return stripeResult;
};
