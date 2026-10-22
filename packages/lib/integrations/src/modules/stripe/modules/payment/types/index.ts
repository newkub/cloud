// ============================================================================
// Payment Module - Domain Types
// ============================================================================

import type { Result } from "#shared/types/result-either";
import type { PaymentIntent, PaymentMethod, Refund } from "../domain/models";

// Re-export domain models
export type { PaymentIntent, PaymentMethod, Refund };

// Payment Intent Status
export type PaymentIntentStatus =
	| "requires_payment_method"
	| "requires_confirmation"
	| "requires_action"
	| "processing"
	| "succeeded"
	| "canceled"
	| "failed";

// Create Payment Intent Request
export interface CreatePaymentIntentRequest {
	readonly amount: number;
	readonly currency: string;
	readonly customerId?: string;
	readonly paymentMethodId?: string;
	readonly description?: string;
	readonly metadata?: Record<string, string>;
	readonly confirm?: boolean;
}

// Confirm Payment Request
export interface ConfirmPaymentRequest {
	readonly paymentIntentId: string;
	readonly paymentMethodId?: string;
	readonly return_url?: string;
}

// Refund Request
export interface RefundRequest {
	readonly paymentIntentId: string;
	readonly amount?: number;
	readonly reason?: "duplicate" | "fraudulent" | "requested_by_customer";
	readonly metadata?: Record<string, string>;
}

// Validation
export type ValidationResult = Result<unknown, Error>;
