// ============================================================================
// Infrastructure - Invoice Repository (Pure Functions)
// ============================================================================

import { and, desc, eq, isNull } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { InvoiceFilters } from "#modules/invoice/types";
import type { Result } from "#shared/types/result-either";
import { failure, success } from "#shared/types/result-helpers";
import { getDb } from "../connection";
import type {
	InvoiceItemSchema,
	InvoiceSchema,
	NewInvoiceItemSchema,
	NewInvoiceSchema,
} from "./schema/invoices";
import { invoiceItems, invoices } from "./schema/invoices";

// ============================================================================
// Database Connection Helper
// ============================================================================

function getDbConnection(): PostgresJsDatabase {
	return getDb() as unknown as PostgresJsDatabase;
}

// ============================================================================
// Invoice Repository Functions
// ============================================================================

export async function create(
	data: Omit<NewInvoiceSchema, "id" | "createdAt">,
	now: number = Date.now(),
): Promise<Result<InvoiceSchema>> {
	try {
		const db = getDbConnection();
		const [invoice] = await db
			.insert(invoices)
			.values({
				...data,
				createdAt: new Date(now),
			})
			.returning();
		return success(invoice);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function findById(
	id: number,
): Promise<Result<InvoiceSchema | null>> {
	try {
		const db = getDbConnection();
		const [invoice] = await db
			.select()
			.from(invoices)
			.where(and(eq(invoices.id, id), isNull(invoices.deletedAt)))
			.limit(1);
		return success(invoice ?? null);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function findByStripeInvoiceId(
	stripeInvoiceId: string,
): Promise<Result<InvoiceSchema | null>> {
	try {
		const db = getDbConnection();
		const [invoice] = await db
			.select()
			.from(invoices)
			.where(
				and(
					eq(invoices.stripeInvoiceId, stripeInvoiceId),
					isNull(invoices.deletedAt),
				),
			)
			.limit(1);
		return success(invoice ?? null);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function findAll(
	filters?: InvoiceFilters,
): Promise<Result<InvoiceSchema[]>> {
	try {
		const db = getDbConnection();
		const conditions = [isNull(invoices.deletedAt)];

		if (filters?.customerId) {
			conditions.push(eq(invoices.customerId, filters.customerId));
		}

		if (filters?.subscriptionId) {
			conditions.push(eq(invoices.subscriptionId, filters.subscriptionId));
		}

		if (filters?.status) {
			conditions.push(eq(invoices.status, filters.status));
		}

		const query = db
			.select()
			.from(invoices)
			.where(and(...conditions));

		const invoiceList = await query.orderBy(desc(invoices.createdAt));
		return success(invoiceList);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function update(
	id: number,
	data: Partial<NewInvoiceSchema>,
): Promise<Result<InvoiceSchema>> {
	try {
		const db = getDbConnection();
		const [invoice] = await db
			.update(invoices)
			.set(data)
			.where(eq(invoices.id, id))
			.returning();
		return success(invoice);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function deleteInvoice(
	id: number,
	now: number = Date.now(),
): Promise<Result<void>> {
	try {
		const db = getDbConnection();
		await db
			.update(invoices)
			.set({ deletedAt: new Date(now) })
			.where(eq(invoices.id, id));
		return success(undefined);
	} catch (error) {
		return failure(error as Error);
	}
}

// ============================================================================
// Invoice Item Functions
// ============================================================================

export async function createItem(
	data: Omit<NewInvoiceItemSchema, "id" | "createdAt">,
	now: number = Date.now(),
): Promise<Result<InvoiceItemSchema>> {
	try {
		const db = getDbConnection();
		const [item] = await db
			.insert(invoiceItems)
			.values({
				...data,
				createdAt: new Date(now),
			})
			.returning();
		return success(item);
	} catch (error) {
		return failure(error as Error);
	}
}

export async function findItemsByInvoiceId(
	invoiceId: string,
): Promise<Result<InvoiceItemSchema[]>> {
	try {
		const db = getDbConnection();
		const items = await db
			.select()
			.from(invoiceItems)
			.where(eq(invoiceItems.invoiceId, invoiceId));
		return success(items);
	} catch (error) {
		return failure(error as Error);
	}
}

// ============================================================================
// Invoice Repository (Exported Object)
// ============================================================================

export const invoiceRepository = {
	create,
	findById,
	findByStripeInvoiceId,
	findAll,
	update,
	delete: deleteInvoice,
	createItem,
	findItemsByInvoiceId,
};
