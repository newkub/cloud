// ============================================================================
// Invoice Module - Domain Events
// ============================================================================

import type { Invoice } from "../../types";

// Base event type
export interface BaseDomainEvent {
	readonly eventType: string;
	readonly aggregateId: string;
	readonly occurredAt: Date;
	readonly version: number;
}

// Invoice Events
export interface InvoiceCreatedEvent extends BaseDomainEvent {
	readonly eventType: "InvoiceCreated";
	readonly aggregateId: string;
	readonly invoiceId: string;
	readonly customerId: string;
	readonly amountDue: number;
	readonly currency: string;
}

export interface InvoiceFinalizedEvent extends BaseDomainEvent {
	readonly eventType: "InvoiceFinalized";
	readonly aggregateId: string;
	readonly invoiceId: string;
	readonly finalizedAt: Date;
}

export interface InvoicePaidEvent extends BaseDomainEvent {
	readonly eventType: "InvoicePaid";
	readonly aggregateId: string;
	readonly invoiceId: string;
	readonly amountPaid: number;
	readonly paidAt: Date;
}

export interface InvoiceVoidedEvent extends BaseDomainEvent {
	readonly eventType: "InvoiceVoided";
	readonly aggregateId: string;
	readonly invoiceId: string;
	readonly voidedAt: Date;
}

export interface InvoiceMarkedUncollectibleEvent extends BaseDomainEvent {
	readonly eventType: "InvoiceMarkedUncollectible";
	readonly aggregateId: string;
	readonly invoiceId: string;
	readonly reason: string;
	readonly markedAt: Date;
}

// Union type for all invoice events
export type InvoiceDomainEvent =
	| InvoiceCreatedEvent
	| InvoiceFinalizedEvent
	| InvoicePaidEvent
	| InvoiceVoidedEvent
	| InvoiceMarkedUncollectibleEvent;

// Event constructors
export const createInvoiceCreatedEvent = (
	invoice: Invoice,
	now: number = Date.now(),
): InvoiceCreatedEvent => ({
	eventType: "InvoiceCreated",
	aggregateId: invoice.id,
	invoiceId: invoice.id,
	customerId: invoice.customerId,
	amountDue: invoice.amountDue,
	currency: invoice.currency,
	occurredAt: new Date(now),
	version: 1,
});

export const createInvoiceFinalizedEvent = (
	invoice: Invoice,
	now: number = Date.now(),
): InvoiceFinalizedEvent => ({
	eventType: "InvoiceFinalized",
	aggregateId: invoice.id,
	invoiceId: invoice.id,
	finalizedAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});

export const createInvoicePaidEvent = (
	invoice: Invoice,
	now: number = Date.now(),
): InvoicePaidEvent => ({
	eventType: "InvoicePaid",
	aggregateId: invoice.id,
	invoiceId: invoice.id,
	amountPaid: invoice.amountPaid,
	paidAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});

export const createInvoiceVoidedEvent = (
	invoice: Invoice,
	now: number = Date.now(),
): InvoiceVoidedEvent => ({
	eventType: "InvoiceVoided",
	aggregateId: invoice.id,
	invoiceId: invoice.id,
	voidedAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});

export const createInvoiceMarkedUncollectibleEvent = (
	invoice: Invoice,
	reason: string,
	now: number = Date.now(),
): InvoiceMarkedUncollectibleEvent => ({
	eventType: "InvoiceMarkedUncollectible",
	aggregateId: invoice.id,
	invoiceId: invoice.id,
	reason,
	markedAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});
