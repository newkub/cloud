// ============================================================================
// Infrastructure - Database Schema - Invoices
// ============================================================================

import {
	index,
	numeric,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const invoices = pgTable(
	"invoices",
	{
		id: serial("id").primaryKey(),
		stripeInvoiceId: text("stripe_invoice_id").notNull().unique(),
		customerId: text("customer_id").notNull(),
		subscriptionId: text("subscription_id"),
		number: text("number").notNull(),
		status: text("status").notNull(), // 'draft', 'open', 'paid', 'void', 'uncollectible'
		amountDue: numeric("amount_due", { precision: 10, scale: 2 }).notNull(),
		amountPaid: numeric("amount_paid", { precision: 10, scale: 2 })
			.notNull()
			.default("0"),
		currency: text("currency").notNull().default("usd"),
		dueDate: timestamp("due_date"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		finalizedAt: timestamp("finalized_at"),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		stripeInvoiceIdx: index("invoices_stripe_invoice_idx").on(
			table.stripeInvoiceId,
		),
		customerIdx: index("invoices_customer_idx").on(table.customerId),
		subscriptionIdx: index("invoices_subscription_idx").on(
			table.subscriptionId,
		),
		statusIdx: index("invoices_status_idx").on(table.status),
	}),
);

export const invoiceItems = pgTable(
	"invoice_items",
	{
		id: serial("id").primaryKey(),
		invoiceId: text("invoice_id").notNull(),
		description: text("description").notNull(),
		quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
		unitAmount: numeric("unit_amount", { precision: 10, scale: 2 }).notNull(),
		amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
		currency: text("currency").notNull().default("usd"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => ({
		invoiceIdx: index("invoice_items_invoice_idx").on(table.invoiceId),
	}),
);

export type InvoiceSchema = typeof invoices.$inferSelect;
export type NewInvoiceSchema = typeof invoices.$inferInsert;
export type InvoiceItemSchema = typeof invoiceItems.$inferSelect;
export type NewInvoiceItemSchema = typeof invoiceItems.$inferInsert;
