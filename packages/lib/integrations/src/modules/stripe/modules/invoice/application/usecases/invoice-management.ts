// ============================================================================
// Invoice Module - Application Layer - Invoice Management
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import {
	createInvoiceCreatedEvent,
	createInvoiceFinalizedEvent,
	createInvoiceMarkedUncollectibleEvent,
	createInvoiceVoidedEvent,
} from "../../domain/events/invoice-events";
import { validateCreateInvoiceRequest } from "../../domain/validators/validation";
import type {
	InvoiceRepository,
	StripeInvoiceAdapter,
} from "../../ports/invoice-repository";
import type {
	CreateInvoiceRequest,
	Invoice,
	InvoiceFilters,
} from "../../types";

// Dependencies
export interface InvoiceManagementDependencies {
	readonly repository: InvoiceRepository;
	readonly stripeAdapter: StripeInvoiceAdapter;
	readonly eventPublisher?: {
		publish(event: unknown): AsyncResult<void, Error>;
	};
}

// Create Invoice
export const createInvoice = async (
	request: CreateInvoiceRequest,
	dependencies: InvoiceManagementDependencies,
	now: number,
): AsyncResult<Invoice, Error> => {
	// Validate request
	const validationResult = validateCreateInvoiceRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Create invoice via Stripe
	const stripeResult = await dependencies.stripeAdapter.createInvoice(
		{
			customer: request.customerId,
			subscription: request.subscriptionId,
			description: request.description,
			due_date: request.dueDate
				? Math.floor(request.dueDate.getTime() / 1000)
				: undefined,
			metadata: request.metadata,
		},
		now,
	);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Add items if provided
	if (request.items) {
		for (const item of request.items) {
			const itemResult = await dependencies.stripeAdapter.createInvoiceItem({
				invoice: stripeResult.data.id,
				description: item.description,
				quantity: item.quantity,
				unit_amount: item.unitAmount,
			});
			if (!itemResult.success) {
				return itemResult;
			}
		}
	}

	// Save to repository
	const saveResult = await dependencies.repository.createInvoice(request);
	if (!saveResult.success) {
		return saveResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createInvoiceCreatedEvent(saveResult.data),
		);
	}

	return saveResult;
};

// Get Invoice
export const getInvoice = async (
	invoiceId: string,
	dependencies: InvoiceManagementDependencies,
): AsyncResult<Invoice, Error> => {
	return dependencies.repository.getInvoice(invoiceId);
};

// Get Invoices
export const getInvoices = async (
	dependencies: InvoiceManagementDependencies,
	filters?: InvoiceFilters,
): AsyncResult<readonly Invoice[], Error> => {
	return dependencies.repository.getInvoices(filters);
};

// Finalize Invoice
export const finalizeInvoice = async (
	invoiceId: string,
	dependencies: InvoiceManagementDependencies,
	now: Date,
): AsyncResult<Invoice, Error> => {
	const stripeResult = await dependencies.stripeAdapter.finalizeInvoice(
		invoiceId,
		now,
	);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Update in repository
	const updateResult = await dependencies.repository.finalizeInvoice(invoiceId);
	if (!updateResult.success) {
		return updateResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createInvoiceFinalizedEvent(updateResult.data),
		);
	}

	return updateResult;
};

// Void Invoice
export const voidInvoice = async (
	invoiceId: string,
	dependencies: InvoiceManagementDependencies,
): AsyncResult<Invoice, Error> => {
	const stripeResult = await dependencies.stripeAdapter.voidInvoice(invoiceId);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Update in repository
	const updateResult = await dependencies.repository.voidInvoice(invoiceId);
	if (!updateResult.success) {
		return updateResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createInvoiceVoidedEvent(updateResult.data),
		);
	}

	return updateResult;
};

// Mark Uncollectible
export const markUncollectible = async (
	invoiceId: string,
	dependencies: InvoiceManagementDependencies,
	reason?: string,
): AsyncResult<Invoice, Error> => {
	const stripeResult = await dependencies.stripeAdapter.markUncollectible(
		invoiceId,
		reason,
	);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Update in repository
	const updateResult = await dependencies.repository.markUncollectible(
		invoiceId,
		reason,
	);
	if (!updateResult.success) {
		return updateResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createInvoiceMarkedUncollectibleEvent(
				updateResult.data,
				reason || "Manual",
			),
		);
	}

	return updateResult;
};
