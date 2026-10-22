// ============================================================================
// Subscription Module - HTTP Adapter (Barrel Export)
// ============================================================================

// Re-export from split files for backward compatibility
export * from "./http-helpers";
export * from "./member-subscription-api";
export * from "./plan-api";

import * as SubscriptionAPI from "./member-subscription-api";
import * as PlanAPI from "./plan-api";

// Repository Interface Implementation (for type compatibility)
export const httpSubscriptionPlanRepository = {
	createPlan: PlanAPI.createPlan,
	updatePlan: PlanAPI.updatePlan,
	deletePlan: PlanAPI.deletePlan,
	getPlan: PlanAPI.getPlan,
	getPlansByOrganization: PlanAPI.getPlansByOrganization,
	getAllPlans: PlanAPI.getAllPlans,
	getActivePlans: PlanAPI.getActivePlans,
	getPublicPlans: PlanAPI.getPublicPlans,
} as const;

export const httpMemberSubscriptionRepository = {
	createSubscription: SubscriptionAPI.createSubscription,
	updateSubscription: SubscriptionAPI.updateSubscription,
	deleteSubscription: SubscriptionAPI.deleteSubscription,
	getSubscription: SubscriptionAPI.getSubscription,
	getSubscriptionsByCustomer: SubscriptionAPI.getSubscriptionsByCustomer,
	getSubscriptionsByPlan: SubscriptionAPI.getSubscriptionsByPlan,
	getActiveSubscriptions: SubscriptionAPI.getActiveSubscriptions,
	getSubscriptionsWithFilters: SubscriptionAPI.getSubscriptionsWithFilters,
	getAllSubscriptions: SubscriptionAPI.getAllSubscriptions,
} as const;
