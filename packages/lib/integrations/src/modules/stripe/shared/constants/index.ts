// ============================================================================
// Shared Kernel - Constants
// ============================================================================

export const STRIPE_API_VERSION = "2026-08-26.dahlia";
export const STRIPE_CURRENCY = "usd";
export const STRIPE_LOCALE = "en";

export const SUBSCRIPTION_STATUSES = [
	"active",
	"paused",
	"cancelled",
	"past_due",
	"trialing",
] as const;
export const BILLING_INTERVALS = ["monthly", "yearly"] as const;
