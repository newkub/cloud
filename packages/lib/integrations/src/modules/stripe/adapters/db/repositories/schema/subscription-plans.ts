// ============================================================================
// Infrastructure - Database Schema - Subscription Plans
// ============================================================================

import {
	boolean,
	index,
	numeric,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const subscriptionPlans = pgTable(
	"subscription_plans",
	{
		id: serial("id").primaryKey(),
		organizationId: text("organization_id").notNull(),
		name: text("name").notNull(),
		description: text("description"),
		price: numeric("price", { precision: 10, scale: 2 }).notNull(),
		currency: text("currency").notNull().default("usd"),
		billingInterval: text("billing_interval").notNull(), // 'monthly', 'yearly'
		trialDays: serial("trial_days").default(0),
		isActive: boolean("is_active").notNull().default(true),
		isPublic: boolean("is_public").notNull().default(false),
		benefits: text("benefits").array(), // JSON array of benefits
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		organizationIdx: index("subscription_plans_organization_idx").on(
			table.organizationId,
		),
		activeIdx: index("subscription_plans_active_idx").on(table.isActive),
		publicIdx: index("subscription_plans_public_idx").on(table.isPublic),
	}),
);

export type SubscriptionPlanSchema = typeof subscriptionPlans.$inferSelect;
export type NewSubscriptionPlanSchema = typeof subscriptionPlans.$inferInsert;
