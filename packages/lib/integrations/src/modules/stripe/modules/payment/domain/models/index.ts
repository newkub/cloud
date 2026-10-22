// ============================================================================
// Payment Module - Domain Models (Readonly Data Models)
// ============================================================================

// Payment Intent Model
export interface PaymentIntent {
	readonly id: string;
	readonly amount: number;
	readonly currency: string;
	readonly status:
		| "requires_payment_method"
		| "requires_confirmation"
		| "requires_action"
		| "processing"
		| "succeeded"
		| "canceled"
		| "failed";
	readonly customerId?: string;
	readonly description?: string;
	readonly metadata?: Record<string, string>;
	readonly createdAt: Date;
}

// Payment Method Model
export interface PaymentMethod {
	readonly id: string;
	readonly type: "card" | "bank_account" | "sepa_debit" | "link";
	readonly customerId?: string;
	readonly isDefault?: boolean;
	readonly createdAt: Date;
}

// Refund Model
export interface Refund {
	readonly id: string;
	readonly paymentIntentId: string;
	readonly amount: number;
	readonly currency: string;
	readonly status: "pending" | "succeeded" | "failed" | "canceled";
	readonly reason?:
		| "duplicate"
		| "fraudulent"
		| "requested_by_customer"
		| "expired_uncaptured_charge";
	readonly createdAt: Date;
}
