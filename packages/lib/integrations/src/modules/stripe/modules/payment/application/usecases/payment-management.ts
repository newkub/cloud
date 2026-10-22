// ============================================================================
// Payment Module - Application Layer - Payment Management
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import {
	createPaymentIntentCreatedEvent,
	createPaymentIntentFailedEvent,
	createPaymentIntentSucceededEvent,
	createRefundCreatedEvent,
	createRefundSucceededEvent,
} from "../../domain/events/payment-events";
import {
	validateConfirmPaymentRequest,
	validateCreatePaymentIntentRequest,
	validateRefundRequest,
} from "../../domain/validators/validation";
import type {
	PaymentRepository,
	StripePaymentAdapter,
} from "../../ports/payment-repository";
import type {
	ConfirmPaymentRequest,
	CreatePaymentIntentRequest,
	PaymentIntent,
	Refund,
	RefundRequest,
} from "../../types";

// Dependencies
export interface PaymentManagementDependencies {
	readonly repository: PaymentRepository;
	readonly stripeAdapter: StripePaymentAdapter;
	readonly eventPublisher?: {
		publish(event: unknown): AsyncResult<void, Error>;
	};
}

// Create Payment Intent
export const createPaymentIntent = async (
	request: CreatePaymentIntentRequest,
	dependencies: PaymentManagementDependencies,
): AsyncResult<PaymentIntent, Error> => {
	// Validate request
	const validationResult = validateCreatePaymentIntentRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Create payment intent via Stripe
	const stripeResult = await dependencies.stripeAdapter.createPaymentIntent({
		amount: request.amount,
		currency: request.currency,
		customer: request.customerId,
		payment_method: request.paymentMethodId,
		description: request.description,
		metadata: request.metadata,
		confirm: request.confirm,
	});
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Save to repository
	const saveResult = await dependencies.repository.createPaymentIntent({
		amount: request.amount,
		currency: request.currency,
		customer: request.customerId,
		payment_method: request.paymentMethodId,
		description: request.description,
		metadata: request.metadata,
		confirm: request.confirm,
	});
	if (!saveResult.success) {
		return saveResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createPaymentIntentCreatedEvent(saveResult.data),
		);
	}

	return saveResult;
};

// Get Payment Intent
export const getPaymentIntent = async (
	paymentIntentId: string,
	dependencies: PaymentManagementDependencies,
): AsyncResult<PaymentIntent, Error> => {
	return dependencies.repository.getPaymentIntent(paymentIntentId);
};

// Get Payment Intents by Customer
export const getPaymentIntentsByCustomer = async (
	customerId: string,
	dependencies: PaymentManagementDependencies,
): AsyncResult<readonly PaymentIntent[], Error> => {
	return dependencies.repository.getPaymentIntentsByCustomer(customerId);
};

// Confirm Payment
export const confirmPayment = async (
	request: ConfirmPaymentRequest,
	dependencies: PaymentManagementDependencies,
): AsyncResult<PaymentIntent, Error> => {
	// Validate request
	const validationResult = validateConfirmPaymentRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Confirm via Stripe
	const stripeResult = await dependencies.stripeAdapter.confirmPayment({
		payment_intent: request.paymentIntentId,
		payment_method: request.paymentMethodId,
		return_url: request.return_url,
	});
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Update in repository
	const updateResult = await dependencies.repository.updatePaymentIntent(
		request.paymentIntentId,
		{ status: stripeResult.data.status },
	);
	if (!updateResult.success) {
		return updateResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		if (stripeResult.data.status === "succeeded") {
			await dependencies.eventPublisher.publish(
				createPaymentIntentSucceededEvent(updateResult.data),
			);
		} else if (stripeResult.data.status === "failed") {
			await dependencies.eventPublisher.publish(
				createPaymentIntentFailedEvent(updateResult.data, "Payment failed"),
			);
		}
	}

	return updateResult;
};

// Cancel Payment Intent
export const cancelPaymentIntent = async (
	paymentIntentId: string,
	dependencies: PaymentManagementDependencies,
): AsyncResult<PaymentIntent, Error> => {
	const stripeResult =
		await dependencies.stripeAdapter.cancelPaymentIntent(paymentIntentId);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Update in repository
	const updateResult = await dependencies.repository.updatePaymentIntent(
		paymentIntentId,
		{ status: "canceled" },
	);
	if (!updateResult.success) {
		return updateResult;
	}

	return updateResult;
};

// Create Refund
export const createRefund = async (
	request: RefundRequest,
	dependencies: PaymentManagementDependencies,
): AsyncResult<Refund, Error> => {
	// Validate request
	const validationResult = validateRefundRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Create refund via Stripe
	const stripeResult = await dependencies.stripeAdapter.createRefund({
		payment_intent: request.paymentIntentId,
		amount: request.amount,
		reason: request.reason,
		metadata: request.metadata,
	});
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Save to repository
	const saveResult = await dependencies.repository.createRefund({
		payment_intent: request.paymentIntentId,
		amount: request.amount,
		reason: request.reason,
		metadata: request.metadata,
	});
	if (!saveResult.success) {
		return saveResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createRefundCreatedEvent(saveResult.data),
		);
		if (saveResult.data.status === "succeeded") {
			await dependencies.eventPublisher.publish(
				createRefundSucceededEvent(saveResult.data),
			);
		}
	}

	return saveResult;
};

// Get Refunds
export const getRefunds = async (
	paymentIntentId: string,
	dependencies: PaymentManagementDependencies,
): AsyncResult<readonly Refund[], Error> => {
	return dependencies.repository.getRefunds(paymentIntentId);
};
