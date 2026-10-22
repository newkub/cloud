// ============================================================================
// Checkout Module - Domain Types
// ============================================================================

import type { Result } from "#shared/types/result-either";
import type { CheckoutSession, LineItem } from "../domain/models";

// Re-export domain models
export type { CheckoutSession, LineItem };

// Create Checkout Session Request
export interface CreateCheckoutSessionRequest {
	readonly priceId: string;
	readonly quantity?: number;
	readonly customerId?: string;
	readonly successUrl: string;
	readonly cancelUrl: string;
	readonly mode?: "payment" | "subscription";
	readonly metadata?: Record<string, string>;
	readonly allowPromotionCodes?: boolean;
	readonly customerEmail?: string;
}

// Validation
export type ValidationResult = Result<unknown, Error>;
