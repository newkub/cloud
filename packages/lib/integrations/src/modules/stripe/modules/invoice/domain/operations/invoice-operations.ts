// ============================================================================
// Invoice Module - Domain Operations (Pure Functions)
// ============================================================================

import type { Invoice } from "../../types";

// Invoice Creation
export const createInvoice = (
	params: {
		id: string;
		number: string;
		customerId: string;
		amountDue: number;
		currency: string;
	},
	now: number = Date.now(),
): Invoice => ({
	id: params.id,
	number: params.number,
	status: "draft",
	amountDue: params.amountDue,
	amountPaid: 0,
	amountRemaining: params.amountDue,
	currency: params.currency,
	customerId: params.customerId,
	createdAt: new Date(now),
});

// Invoice Status Checks
export const isInvoiceDraft = (invoice: Invoice): boolean =>
	invoice.status === "draft";

export const isInvoiceOpen = (invoice: Invoice): boolean =>
	invoice.status === "open";

export const isInvoicePaid = (invoice: Invoice): boolean =>
	invoice.status === "paid";

export const isInvoiceUncollectible = (invoice: Invoice): boolean =>
	invoice.status === "uncollectible";

export const isInvoiceVoid = (invoice: Invoice): boolean =>
	invoice.status === "void";

export const isInvoiceOverdue = (
	invoice: Invoice,
	now: number = Date.now(),
): boolean =>
	isInvoiceOpen(invoice) && invoice.dueDate
		? invoice.dueDate < new Date(now)
		: false;

// Invoice Actions
export const canFinalizeInvoice = (invoice: Invoice): boolean =>
	isInvoiceDraft(invoice);

export const canVoidInvoice = (invoice: Invoice): boolean =>
	isInvoiceDraft(invoice) || isInvoiceOpen(invoice);

export const canMarkUncollectible = (invoice: Invoice): boolean =>
	isInvoiceOpen(invoice);

// Amount Calculations
export const calculateTotalAmount = (
	items: readonly { quantity: number; unitAmount: number }[],
): number =>
	items.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0);

export const calculateTaxAmount = (subtotal: number, taxRate: number): number =>
	subtotal * (taxRate / 100);

export const calculateDiscountAmount = (
	subtotal: number,
	discountPercent: number,
): number => subtotal * (discountPercent / 100);

// Invoice Display
export const getInvoiceNumber = (invoice: Invoice): string => invoice.number;

export const getInvoiceDisplayAmount = (invoice: Invoice): string => {
	return `${(invoice.amountDue / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`;
};
