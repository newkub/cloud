// ============================================================================
// Infrastructure - Database Schema - Customers
// ============================================================================

import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const customers = pgTable(
	"customers",
	{
		id: serial("id").primaryKey(),
		stripeCustomerId: text("stripe_customer_id").notNull().unique(),
		email: text("email").notNull(),
		name: text("name"),
		phone: text("phone"),
		description: text("description"),
		metadata: text("metadata"), // JSON string for additional data
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		stripeCustomerIdx: index("customers_stripe_customer_idx").on(
			table.stripeCustomerId,
		),
		emailIdx: index("customers_email_idx").on(table.email),
	}),
);

export type CustomerSchema = typeof customers.$inferSelect;
export type NewCustomerSchema = typeof customers.$inferInsert;
