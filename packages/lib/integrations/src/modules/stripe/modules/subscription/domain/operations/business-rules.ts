// ============================================================================
// Subscription Module - Domain Business Rules
// ============================================================================

import type { MemberSubscription, SubscriptionPlan } from "../../types";

export const canUpgradePlan = (
	currentPlan: SubscriptionPlan,
	targetPlan: SubscriptionPlan,
): boolean => {
	// Can upgrade if target plan has higher price or more features
	const priceHigher = targetPlan.price > currentPlan.price;
	const moreFeatures = targetPlan.features.length > currentPlan.features.length;

	return priceHigher || moreFeatures;
};

export const canDowngradePlan = (
	currentPlan: SubscriptionPlan,
	targetPlan: SubscriptionPlan,
): boolean => {
	// Can downgrade if target plan has lower price
	return targetPlan.price < currentPlan.price;
};

export const calculateProrationAmount = (
	currentPlan: SubscriptionPlan,
	targetPlan: SubscriptionPlan,
	daysInPeriod: number,
	daysRemaining: number,
): number => {
	const currentDailyRate = currentPlan.price / daysInPeriod;
	const targetDailyRate = targetPlan.price / daysInPeriod;

	const remainingValue = currentDailyRate * daysRemaining;
	const newPeriodValue = targetDailyRate * daysRemaining;

	return newPeriodValue - remainingValue;
};

export const isSubscriptionWithinGracePeriod = (
	subscription: MemberSubscription,
	now: Date,
	gracePeriodDays: number = 3,
): boolean => {
	if (subscription.status !== "past_due") return false;

	if (!subscription.nextBillingDate) return false;
	const nextBillingDate = new Date(subscription.nextBillingDate);
	const gracePeriodEnd = new Date(nextBillingDate);
	gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);

	return now <= gracePeriodEnd;
};

export const canPauseSubscription = (
	subscription: MemberSubscription,
	now: Date,
	maxPauseDays: number = 30,
): boolean => {
	// Only active subscriptions can be paused
	if (subscription.status !== "active") return false;

	// Check if subscription has been paused recently
	if (subscription.cancellationDate) {
		const lastPause = new Date(subscription.cancellationDate);
		const daysSinceLastPause = Math.floor(
			(now.getTime() - lastPause.getTime()) / (1000 * 60 * 60 * 24),
		);

		return daysSinceLastPause >= maxPauseDays;
	}

	return true;
};

export const calculateRefundAmount = (
	subscription: MemberSubscription,
	now: Date,
	refundPolicy: "full" | "partial" | "none" = "partial",
	partialRefundPercentage: number = 0.5,
): number => {
	if (refundPolicy === "none") return 0;
	if (refundPolicy === "full") return subscription.amount || 0;

	// For partial refund, calculate based on remaining days in billing period
	if (!subscription.nextBillingDate || !subscription.startDate) return 0;
	const nextBilling = new Date(subscription.nextBillingDate);
	const totalDays = Math.ceil(
		(nextBilling.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
	);

	const daysUsed = Math.ceil(
		(now.getTime() - new Date(subscription.startDate).getTime()) /
			(1000 * 60 * 60 * 24),
	);

	const totalPeriodDays = totalDays + daysUsed;
	const remainingDaysRatio = totalDays / totalPeriodDays;

	return Math.round(
		(subscription.amount || 0) * remainingDaysRatio * partialRefundPercentage,
	);
};

export const getSubscriptionRenewalDate = (
	subscription: MemberSubscription,
	now: Date,
): Date => {
	if (!subscription.nextBillingDate) {
		return now;
	}
	const renewalDate = new Date(subscription.nextBillingDate);

	// If subscription is cancelled, return cancellation date
	if (subscription.cancellationDate) {
		return new Date(subscription.cancellationDate);
	}

	return renewalDate;
};

export const isTrialExpired = (
	subscription: MemberSubscription,
	now: Date,
): boolean => {
	if (subscription.status !== "trialing") return false;

	if (!subscription.nextBillingDate) return false;
	const trialEnd = new Date(subscription.nextBillingDate);

	return now >= trialEnd;
};
