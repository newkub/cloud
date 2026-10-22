// ============================================================================
// Infrastructure - Invoice Adapter (Pure Functions)
// ============================================================================

import type {
	CreateInvoiceRequest,
	Invoice,
	InvoiceFilters,
} from "#modules/invoice/ports/invoice-repository";
import type { AsyncResult } from "#shared/types/result-either";
import { asyncFailure, asyncSuccess } from "#shared/types/result-helpers";
import { invoiceRepository } from "./db/repositories/invoice-repository";
import type { InvoiceSchema } from "./db/repositories/schema/invoices";

// ============================================================================
// Stripe client helpers
// ============================================================================

const STRIPE_API_BASE = "https://api.stripe.com/v1";

const isStripeEnabled = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY);

const stripeHeaders = (): Record<string, string> => ({
	Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY ?? ""}`,
	"Content-Type": "application/x-www-form-urlencoded",
});

const toError = (error: unknown): Error =>
	error instanceof Error ? error : new Error(String(error));

const formEncode = (params: Record<string, unknown>): string => {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			for (const item of value) search.append(key, String(item));
		} else {
			search.append(key, String(value));
		}
	}
	return search.toString();
};

const stripeGet = async (path: string): Promise<unknown> => {
	const response = await fetch(`${STRIPE_API_BASE}${path}`, {
		method: "GET",
		headers: stripeHeaders(),
	});

	const data = (await response.json()) as { error?: { message: string } };
	if (!response.ok) {
		throw new Error(data.error?.message ?? `Stripe request failed: ${path}`);
	}
	return data;
};

const stripePost = async (
	path: string,
	body: Record<string, unknown>,
): Promise<unknown> => {
	const response = await fetch(`${STRIPE_API_BASE}${path}`, {
		method: "POST",
		headers: stripeHeaders(),
		body: formEncode(body),
	});

	const data = (await response.json()) as { error?: { message: string } };
	if (!response.ok) {
		throw new Error(data.error?.message ?? `Stripe request failed: ${path}`);
	}
	return data;
};

// ============================================================================
// Mapping Functions (Pure)
// ============================================================================

function mapToInvoice(schema: InvoiceSchema): Invoice {
	return {
		id: schema.id.toString(),
		number: schema.number,
		status: schema.status as
			| "draft"
			| "open"
			| "paid"
			| "void"
			| "uncollectible",
		amountDue: Number.parseFloat(schema.amountDue),
		amountPaid: Number.parseFloat(schema.amountPaid),
		amountRemaining:
			Number.parseFloat(schema.amountDue) -
			Number.parseFloat(schema.amountPaid),
		currency: schema.currency,
		customerId: schema.customerId,
		subscriptionId: schema.subscriptionId ?? undefined,
		dueDate: schema.dueDate ? new Date(schema.dueDate) : undefined,
		createdAt: new Date(schema.createdAt),
		finalizedAt: schema.finalizedAt ? new Date(schema.finalizedAt) : undefined,
	};
}

const mapStripeInvoice = (invoice: unknown): Invoice => {
	const i = invoice as Record<string, unknown>;
	const status = i.status as Invoice["status"];
	const amountDue = Number(i.amount_due ?? 0);
	const amountPaid = Number(i.amount_paid ?? 0);
	const dueDate =
		i.due_date === null || i.due_date === undefined
			? undefined
			: new Date((i.due_date as number) * 1000);
	const finalizedAt =
		i.finalized_at === null || i.finalized_at === undefined
			? undefined
			: new Date((i.finalized_at as number) * 1000);

	return {
		id: i.id as string,
		number: (i.number ?? i.id) as string,
		status,
		amountDue,
		amountPaid,
		amountRemaining: amountDue - amountPaid,
		currency: (i.currency ?? "usd") as string,
		customerId: (i.customer as string) ?? (i.customer_id as string),
		subscriptionId:
			i.subscription === null || i.subscription === undefined
				? undefined
				: ((i.subscription as string) ?? (i.subscription_id as string)),
		dueDate,
		createdAt: new Date((i.created as number) * 1000),
		finalizedAt,
	};
};

// ============================================================================
// Invoice Repository Adapter Functions
// ============================================================================

export async function createInvoice(
	request: CreateInvoiceRequest,
	now: number,
): AsyncResult<Invoice, Error> {
	try {
		if (!isStripeEnabled()) {
			const dbResult = await invoiceRepository.create({
				stripeInvoiceId: `inv_${now}`,
				customerId: request.customerId,
				subscriptionId: request.subscriptionId,
				number: `INV-${now}`,
				status: "draft",
				amountDue: "0",
				amountPaid: "0",
				currency: request.currency ?? "usd",
				dueDate: request.dueDate,
			});

			if (!dbResult.success) {
				return asyncFailure(dbResult.error);
			}

			return asyncSuccess(mapToInvoice(dbResult.data));
		}

		const currency = (request.currency ?? "usd") as string;

		// Create invoice items that will be pulled into the new invoice
		for (const item of request.items ?? []) {
			const unitAmount = Math.round(item.unitAmount);
			if (unitAmount <= 0 || item.quantity <= 0) continue;

			await stripePost("/invoiceitems", {
				customer: request.customerId,
				currency,
				unit_amount: unitAmount,
				quantity: item.quantity,
				description: item.description,
			});
		}

		const body: Record<string, unknown> = {
			customer: request.customerId,
			collection_method: "send_invoice",
		};

		if (request.dueDate) {
			body.due_date = Math.floor(request.dueDate.getTime() / 1000);
		}

		if (request.metadata) {
			for (const [key, value] of Object.entries(request.metadata)) {
				body[`metadata[${key}]`] = value;
			}
		}

		const invoice = await stripePost("/invoices", body);
		return asyncSuccess(mapStripeInvoice(invoice));
	} catch (error) {
		return asyncFailure(toError(error));
	}
}

export async function getInvoice(
	invoiceId: string,
): AsyncResult<Invoice, Error> {
	try {
		if (!isStripeEnabled()) {
			const id = Number.parseInt(invoiceId, 10);
			if (Number.isNaN(id)) {
				return asyncFailure(new Error("Invoice not found"));
			}

			const dbResult = await invoiceRepository.findById(id);
			if (!dbResult.success) {
				return asyncFailure(dbResult.error);
			}

			if (!dbResult.data) {
				return asyncFailure(new Error("Invoice not found"));
			}

			return asyncSuccess(mapToInvoice(dbResult.data));
		}

		const invoice = await stripeGet(`/invoices/${invoiceId}`);
		return asyncSuccess(mapStripeInvoice(invoice));
	} catch (error) {
		return asyncFailure(toError(error));
	}
}

export async function getInvoices(
	filters?: InvoiceFilters,
): AsyncResult<readonly Invoice[], Error> {
	try {
		if (!isStripeEnabled()) {
			const dbResult = await invoiceRepository.findAll(filters);
			if (!dbResult.success) {
				return asyncFailure(dbResult.error);
			}

			const invoices = dbResult.data.map(mapToInvoice);
			return asyncSuccess(invoices);
		}

		const params: Record<string, unknown> = {};
		if (filters?.customerId) {
			params.customer = filters.customerId;
		}
		if (filters?.status) {
			params.status = filters.status;
		}
		if (filters?.limit) {
			params.limit = filters.limit;
		}

		const query =
			Object.keys(params).length > 0 ? `?${formEncode(params)}` : "";
		const list = (await stripeGet(`/invoices${query}`)) as {
			data: unknown[];
		};

		return asyncSuccess(list.data.map(mapStripeInvoice));
	} catch (error) {
		return asyncFailure(toError(error));
	}
}

export async function updateInvoice(
	invoiceId: string,
	updates: Record<string, unknown>,
): AsyncResult<Invoice, Error> {
	try {
		if (!isStripeEnabled()) {
			const id = Number.parseInt(invoiceId, 10);
			if (Number.isNaN(id)) {
				return asyncFailure(new Error("Invoice not found"));
			}

			const dbResult = await invoiceRepository.update(id, {
				status: updates.status as string | undefined,
				amountPaid: updates.amountPaid
					? updates.amountPaid.toString()
					: undefined,
				finalizedAt: updates.finalizedAt
					? new Date(updates.finalizedAt as string)
					: undefined,
			});

			if (!dbResult.success) {
				return asyncFailure(dbResult.error);
			}

			return asyncSuccess(mapToInvoice(dbResult.data));
		}

		const body: Record<string, unknown> = {};
		if (typeof updates.status === "string") body.status = updates.status;
		if (updates.metadata && typeof updates.metadata === "object") {
			for (const [key, value] of Object.entries(updates.metadata)) {
				body[`metadata[${key}]`] = value;
			}
		}

		const invoice = await stripePost(`/invoices/${invoiceId}`, body);
		return asyncSuccess(mapStripeInvoice(invoice));
	} catch (error) {
		return asyncFailure(toError(error));
	}
}

export async function finalizeInvoice(
	invoiceId: string,
	now: Date,
): AsyncResult<Invoice, Error> {
	try {
		if (!isStripeEnabled()) {
			const id = Number.parseInt(invoiceId, 10);
			if (Number.isNaN(id)) {
				return asyncFailure(new Error("Invoice not found"));
			}

			const dbResult = await invoiceRepository.update(id, {
				status: "open",
				finalizedAt: now,
			});

			if (!dbResult.success) {
				return asyncFailure(dbResult.error);
			}

			return asyncSuccess(mapToInvoice(dbResult.data));
		}

		const invoice = await stripePost(`/invoices/${invoiceId}/finalize`, {});
		return asyncSuccess(mapStripeInvoice(invoice));
	} catch (error) {
		return asyncFailure(toError(error));
	}
}

export async function voidInvoice(
	invoiceId: string,
): AsyncResult<Invoice, Error> {
	try {
		if (!isStripeEnabled()) {
			const id = Number.parseInt(invoiceId, 10);
			if (Number.isNaN(id)) {
				return asyncFailure(new Error("Invoice not found"));
			}

			const dbResult = await invoiceRepository.update(id, {
				status: "void",
			});

			if (!dbResult.success) {
				return asyncFailure(dbResult.error);
			}

			return asyncSuccess(mapToInvoice(dbResult.data));
		}

		const invoice = await stripePost(`/invoices/${invoiceId}/void`, {});
		return asyncSuccess(mapStripeInvoice(invoice));
	} catch (error) {
		return asyncFailure(toError(error));
	}
}

export async function markUncollectible(
	invoiceId: string,
	_reason?: string,
): AsyncResult<Invoice, Error> {
	try {
		if (!isStripeEnabled()) {
			const id = Number.parseInt(invoiceId, 10);
			if (Number.isNaN(id)) {
				return asyncFailure(new Error("Invoice not found"));
			}

			const dbResult = await invoiceRepository.update(id, {
				status: "uncollectible",
			});

			if (!dbResult.success) {
				return asyncFailure(dbResult.error);
			}

			return asyncSuccess(mapToInvoice(dbResult.data));
		}

		const invoice = await stripePost(
			`/invoices/${invoiceId}/mark_uncollectible`,
			{},
		);
		return asyncSuccess(mapStripeInvoice(invoice));
	} catch (error) {
		return asyncFailure(toError(error));
	}
}

// ============================================================================
// Invoice Adapter (Repository Implementation)
// ============================================================================

export const invoiceAdapter = {
	createInvoice,
	getInvoice,
	getInvoices,
	updateInvoice,
	finalizeInvoice,
	voidInvoice,
	markUncollectible,
};
