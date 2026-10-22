// ============================================================================
// Checkout Module - Ports (Interfaces)
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import type { CheckoutSession, CreateCheckoutSessionRequest } from "../types";

// Repository Port
export interface CheckoutSessionRepository {
	createSession(
		request: CreateCheckoutSessionRequest,
	): AsyncResult<CheckoutSession, Error>;
	getSession(sessionId: string): AsyncResult<CheckoutSession, Error>;
	getSessionsByCustomer(
		customerId: string,
	): AsyncResult<readonly CheckoutSession[], Error>;
}

// Event Publisher Port
export interface CheckoutEventPublisher {
	publish(event: {
		eventType: string;
		[key: string]: unknown;
	}): AsyncResult<void, Error>;
}

// Stripe Adapter Port
export interface StripeCheckoutAdapter {
	createSession(params: {
		line_items: readonly { price: string; quantity: number }[];
		mode?: string;
		success_url: string;
		cancel_url: string;
		customer?: string;
		customer_email?: string;
		metadata?: Record<string, string>;
		allow_promotion_codes?: boolean;
	}): AsyncResult<CheckoutSession, Error>;
	retrieveSession(sessionId: string): AsyncResult<CheckoutSession, Error>;
	expireSession(sessionId: string): AsyncResult<CheckoutSession, Error>;
}
