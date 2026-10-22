// ============================================================================
// Subscription Module - UI Adapter Types
// ============================================================================

import type {
	MemberSubscription,
	SubscriptionFilters,
	SubscriptionPlan,
	SubscriptionStats,
} from "#modules/subscription/types";

// State Types
export type SubscriptionUIState = {
	readonly plans: readonly SubscriptionPlan[];
	readonly subscriptions: readonly MemberSubscription[];
	readonly loading: boolean;
	readonly error: string | null;
};

export type SubscriptionUIDerivedState = {
	readonly stats: SubscriptionStats;
};

// Action Types
export type SubscriptionUIActions = {
	readonly fetchPlans: () => Promise<SubscriptionUIState>;
	readonly fetchSubscriptions: (
		filters?: SubscriptionFilters,
	) => Promise<SubscriptionUIState>;
	readonly createPlan: (
		data: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">,
	) => Promise<SubscriptionUIState>;
	readonly updatePlan: (
		id: string,
		data: Partial<SubscriptionPlan>,
	) => Promise<SubscriptionUIState>;
	readonly deletePlan: (id: string) => Promise<SubscriptionUIState>;
	readonly togglePlan: (
		id: string,
		isActive: boolean,
	) => Promise<SubscriptionUIState>;
	readonly subscribeCustomer: (
		customerId: string,
		planId: string,
		paymentMethod?: string,
	) => Promise<SubscriptionUIState>;
	readonly cancelSubscription: (
		subscriptionId: string,
		reason?: string,
	) => Promise<SubscriptionUIState>;
	readonly pauseSubscription: (
		subscriptionId: string,
	) => Promise<SubscriptionUIState>;
	readonly resumeSubscription: (
		subscriptionId: string,
	) => Promise<SubscriptionUIState>;
	readonly refreshData: () => Promise<SubscriptionUIState>;
};
