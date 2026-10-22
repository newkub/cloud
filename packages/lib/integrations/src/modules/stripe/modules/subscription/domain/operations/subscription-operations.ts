// ============================================================================
// Subscription Module - Domain Operations (Pure Functions)
// ============================================================================

import type {
	MemberSubscription,
	SubscriptionPlan,
	SubscriptionStats,
} from "../../types";

// Pure domain operations with business logic
export const createSubscriptionPlan = (
	data: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">,
	id: string,
	now: string,
): SubscriptionPlan => ({
	...data,
	id,
	createdAt: now,
	updatedAt: now,
});

export const isPlanActive = (plan: SubscriptionPlan): boolean =>
	plan.isActive && plan.isPublic;

export const isPlanEligibleForTrial = (plan: SubscriptionPlan): boolean =>
	plan.trialDays > 0;

export const calculateSubscriptionCost = (
	plan: SubscriptionPlan,
	quantity: number = 1,
): number => {
	const baseCost = plan.price * quantity;
	const setupFee = plan.setupFee || 0;
	return baseCost + setupFee;
};

export const calculateMonthlyEquivalent = (plan: SubscriptionPlan): number => {
	switch (plan.interval) {
		case "monthly":
			return plan.price;
		case "quarterly":
			return plan.price / 3;
		case "yearly":
			return plan.price / 12;
		case "weekly":
			return plan.price * 4.33; // Average weeks per month
		default:
			return plan.price;
	}
};

export const isSubscriptionActive = (
	subscription: MemberSubscription,
): boolean =>
	subscription.status === "active" || subscription.status === "trialing";

export const isSubscriptionCancelled = (
	subscription: MemberSubscription,
): boolean =>
	subscription.status === "cancelled" || subscription.cancelledAt !== undefined;

export const getSubscriptionEndDate = (
	subscription: MemberSubscription,
): string | undefined => subscription.endDate || subscription.cancelledAt;

export const calculateSubscriptionStats = (
	subscriptions: readonly MemberSubscription[],
): SubscriptionStats => {
	const totalSubscriptions = subscriptions.length;
	const activeSubscriptions = subscriptions.filter(isSubscriptionActive);
	const cancelledSubscriptions = subscriptions.filter(isSubscriptionCancelled);
	const trialingSubscriptions = subscriptions.filter(
		(s) => s.status === "trialing",
	);

	const monthlyRecurring = activeSubscriptions.reduce(
		(sum, subscription) => sum + (subscription.amount || 0),
		0,
	);

	const churnRate =
		totalSubscriptions > 0
			? (cancelledSubscriptions.length / totalSubscriptions) * 100
			: 0;

	return {
		totalActive: activeSubscriptions.length,
		monthlyRecurring,
		churnRate,
		trialing: trialingSubscriptions.length,
	};
};
