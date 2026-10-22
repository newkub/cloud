// ============================================================================
// Invoice Module - Domain Types
// ============================================================================

import type { Result } from "#shared/types/result-either";
import type { Invoice, InvoiceItem } from "../domain/models";

// Re-export domain models
export type { Invoice, InvoiceItem };

// Invoice Status
export type InvoiceStatus =
	| "draft"
	| "open"
	| "paid"
	| "uncollectible"
	| "void";

// Create Invoice Request
export interface CreateInvoiceRequest {
	readonly customerId: string;
	readonly subscriptionId?: string;
	readonly description?: string;
	readonly dueDate?: Date;
	readonly currency?: string;
	readonly items?: readonly {
		readonly description: string;
		readonly quantity: number;
		readonly unitAmount: number;
	}[];
	readonly metadata?: Record<string, string>;
}

// Invoice Filters
export interface InvoiceFilters {
	readonly customerId?: string;
	readonly subscriptionId?: string;
	readonly status?: InvoiceStatus;
	readonly limit?: number;
	readonly offset?: number;
}

// Validation
export type ValidationResult = Result<unknown, Error>;
