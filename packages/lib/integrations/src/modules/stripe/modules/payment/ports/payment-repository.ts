// ============================================================================
// Payment Module - Ports (Interfaces)
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import type { PaymentIntent, PaymentMethod, Refund } from "../types";

// Repository Port
export interface PaymentRepository {
	// Payment Intents
	createPaymentIntent(params: {
		amount: number;
		currency: string;
		customer?: string;
		payment_method?: string;
		description?: string;
		metadata?: Record<string, string>;
		confirm?: boolean;
	}): AsyncResult<PaymentIntent, Error>;
	getPaymentIntent(paymentIntentId: string): AsyncResult<PaymentIntent, Error>;
	getPaymentIntentsByCustomer(
		customerId: string,
	): AsyncResult<readonly PaymentIntent[], Error>;
	updatePaymentIntent(
		paymentIntentId: string,
		updates: Record<string, unknown>,
	): AsyncResult<PaymentIntent, Error>;
	cancelPaymentIntent(
		paymentIntentId: string,
	): AsyncResult<PaymentIntent, Error>;

	// Payment Methods
	getPaymentMethods(
		customerId: string,
	): AsyncResult<readonly PaymentMethod[], Error>;
	attachPaymentMethod(
		paymentMethodId: string,
		customerId: string,
	): AsyncResult<PaymentMethod, Error>;
	detachPaymentMethod(
		paymentMethodId: string,
	): AsyncResult<PaymentMethod, Error>;

	// Refunds
	createRefund(params: {
		payment_intent: string;
		amount?: number;
		reason?: string;
		metadata?: Record<string, string>;
	}): AsyncResult<Refund, Error>;
	getRefunds(paymentIntentId: string): AsyncResult<readonly Refund[], Error>;
}

// Event Publisher Port
export interface PaymentEventPublisher {
	publish(event: {
		eventType: string;
		[key: string]: unknown;
	}): AsyncResult<void, Error>;
}

// Stripe Adapter Port
export interface StripePaymentAdapter {
	createPaymentIntent(params: {
		amount: number;
		currency: string;
		customer?: string;
		payment_method?: string;
		description?: string;
		metadata?: Record<string, string>;
		confirm?: boolean;
	}): AsyncResult<PaymentIntent, Error>;
	confirmPayment(params: {
		payment_intent: string;
		payment_method?: string;
		return_url?: string;
	}): AsyncResult<PaymentIntent, Error>;
	retrievePaymentIntent(
		paymentIntentId: string,
	): AsyncResult<PaymentIntent, Error>;
	cancelPaymentIntent(
		paymentIntentId: string,
	): AsyncResult<PaymentIntent, Error>;
	createRefund(params: {
		payment_intent: string;
		amount?: number;
		reason?: string;
		metadata?: Record<string, string>;
	}): AsyncResult<Refund, Error>;
}
