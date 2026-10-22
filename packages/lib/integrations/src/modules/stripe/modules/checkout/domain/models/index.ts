// ============================================================================
// Checkout Module - Domain Models (Readonly Data Models)
// ============================================================================

// Checkout Session Model
export interface CheckoutSession {
	readonly id: string;
	readonly url: string;
	readonly status: "open" | "complete" | "expired";
	readonly paymentStatus: "unpaid" | "paid" | "no_payment_required";
	readonly amountTotal: number;
	readonly currency: string;
	readonly customerId?: string;
	readonly subscriptionId?: string;
	readonly metadata?: Record<string, string>;
	readonly createdAt: Date;
	readonly expiresAt: Date;
}

// Line Item Model
export interface LineItem {
	readonly priceId: string;
	readonly quantity: number;
	readonly amount: number;
	readonly currency: string;
}
