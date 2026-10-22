CREATE TABLE "member_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"status" text NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"cancelled_at" timestamp,
	"paused_at" timestamp,
	"resumed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" text,
	CONSTRAINT "member_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"billing_interval" text NOT NULL,
	"trial_days" serial DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"benefits" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "member_subscriptions_customer_idx" ON "member_subscriptions" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "member_subscriptions_plan_idx" ON "member_subscriptions" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "member_subscriptions_stripe_idx" ON "member_subscriptions" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX "member_subscriptions_status_idx" ON "member_subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subscription_plans_organization_idx" ON "subscription_plans" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "subscription_plans_active_idx" ON "subscription_plans" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "subscription_plans_public_idx" ON "subscription_plans" USING btree ("is_public");