// ============================================================================
// Invoice Module - Ports (Interfaces)
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import type { CreateInvoiceRequest, Invoice, InvoiceFilters } from "../types";

// Re-export types for external use
export type { CreateInvoiceRequest, Invoice, InvoiceFilters } from "../types";

// Repository Port
export interface InvoiceRepository {
	createInvoice(request: CreateInvoiceRequest): AsyncResult<Invoice, Error>;
	getInvoice(invoiceId: string): AsyncResult<Invoice, Error>;
	getInvoices(filters?: InvoiceFilters): AsyncResult<readonly Invoice[], Error>;
	updateInvoice(
		invoiceId: string,
		updates: Record<string, unknown>,
	): AsyncResult<Invoice, Error>;
	finalizeInvoice(invoiceId: string): AsyncResult<Invoice, Error>;
	voidInvoice(invoiceId: string): AsyncResult<Invoice, Error>;
	markUncollectible(
		invoiceId: string,
		reason?: string,
	): AsyncResult<Invoice, Error>;
}

// Event Publisher Port
export interface InvoiceEventPublisher {
	publish(event: {
		eventType: string;
		[key: string]: unknown;
	}): AsyncResult<void, Error>;
}

// Stripe Adapter Port
export interface StripeInvoiceAdapter {
	createInvoice(
		params: {
			customer: string;
			subscription?: string;
			description?: string;
			due_date?: number;
			metadata?: Record<string, string>;
		},
		now: number,
	): AsyncResult<Invoice, Error>;
	createInvoiceItem(params: {
		invoice: string;
		description: string;
		quantity: number;
		unit_amount: number;
	}): AsyncResult<Invoice, Error>;
	finalizeInvoice(invoiceId: string, now: Date): AsyncResult<Invoice, Error>;
	voidInvoice(invoiceId: string): AsyncResult<Invoice, Error>;
	markUncollectible(
		invoiceId: string,
		reason?: string,
	): AsyncResult<Invoice, Error>;
	retrieveInvoice(invoiceId: string): AsyncResult<Invoice, Error>;
	listInvoices(params?: {
		customer?: string;
		subscription?: string;
		status?: string;
	}): AsyncResult<readonly Invoice[], Error>;
}
