// ============================================================================
// Invoice Module - Domain Models (Readonly Data Models)
// ============================================================================

// Invoice Model
export interface Invoice {
	readonly id: string;
	readonly number: string;
	readonly status: "draft" | "open" | "paid" | "void" | "uncollectible";
	readonly amountDue: number;
	readonly amountPaid: number;
	readonly amountRemaining: number;
	readonly currency: string;
	readonly customerId: string;
	readonly subscriptionId?: string;
	readonly dueDate?: Date;
	readonly createdAt: Date;
	readonly finalizedAt?: Date;
}

// Invoice Item Model
export interface InvoiceItem {
	readonly id: string;
	readonly invoiceId: string;
	readonly description?: string;
	readonly quantity: number;
	readonly unitAmount: number;
	readonly amount: number;
	readonly currency: string;
}
