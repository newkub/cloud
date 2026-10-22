// ============================================================================
// Infrastructure - Database Schema - Member Subscriptions
// ============================================================================

import {
	boolean,
	index,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const memberSubscriptions = pgTable(
	"member_subscriptions",
	{
		id: serial("id").primaryKey(),
		customerId: text("customer_id").notNull(),
		planId: text("plan_id").notNull(),
		stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
		status: text("status").notNull(), // 'active', 'paused', 'cancelled', 'past_due', 'trialing'
		currentPeriodStart: timestamp("current_period_start").notNull(),
		currentPeriodEnd: timestamp("current_period_end").notNull(),
		trialStart: timestamp("trial_start"),
		trialEnd: timestamp("trial_end"),
		cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
		cancelledAt: timestamp("cancelled_at"),
		pausedAt: timestamp("paused_at"),
		resumedAt: timestamp("resumed_at"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		metadata: text("metadata"), // JSON string for additional data
	},
	(table) => ({
		customerIdx: index("member_subscriptions_customer_idx").on(
			table.customerId,
		),
		planIdx: index("member_subscriptions_plan_idx").on(table.planId),
		stripeSubscriptionIdx: index("member_subscriptions_stripe_idx").on(
			table.stripeSubscriptionId,
		),
		statusIdx: index("member_subscriptions_status_idx").on(table.status),
	}),
);

export type MemberSubscriptionSchema = typeof memberSubscriptions.$inferSelect;
export type NewMemberSubscriptionSchema =
	typeof memberSubscriptions.$inferInsert;
