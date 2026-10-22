// ============================================================================
// Subscription Module - UI State Functions
// ============================================================================

import { calculateSubscriptionStats } from "#modules/subscription/domain/operations/subscription-operations";
import type {
	MemberSubscription,
	SubscriptionPlan,
} from "#modules/subscription/types";
import type { SubscriptionUIDerivedState, SubscriptionUIState } from "./types";

// State Creation Functions
export const createInitialSubscriptionState = (): SubscriptionUIState => ({
	plans: [],
	subscriptions: [],
	loading: false,
	error: null,
});

export const setLoadingState = (
	state: SubscriptionUIState,
	isLoading: boolean,
): SubscriptionUIState => ({
	...state,
	loading: isLoading,
	error: isLoading ? null : state.error,
});

export const setErrorState = (
	state: SubscriptionUIState,
	errorMessage: string,
): SubscriptionUIState => ({
	...state,
	loading: false,
	error: errorMessage,
});

export const setPlansState = (
	state: SubscriptionUIState,
	plans: readonly SubscriptionPlan[],
): SubscriptionUIState => ({
	...state,
	plans,
	loading: false,
	error: null,
});

export const setSubscriptionsState = (
	state: SubscriptionUIState,
	subscriptions: readonly MemberSubscription[],
): SubscriptionUIState => ({
	...state,
	subscriptions,
	loading: false,
	error: null,
});

export const addPlanState = (
	state: SubscriptionUIState,
	plan: SubscriptionPlan,
): SubscriptionUIState => ({
	...state,
	plans: [...state.plans, plan],
	loading: false,
	error: null,
});

export const updatePlanState = (
	state: SubscriptionUIState,
	updatedPlan: SubscriptionPlan,
): SubscriptionUIState => ({
	...state,
	plans: state.plans.map((plan) =>
		plan.id === updatedPlan.id ? updatedPlan : plan,
	),
	loading: false,
	error: null,
});

export const removePlanState = (
	state: SubscriptionUIState,
	planId: string,
): SubscriptionUIState => ({
	...state,
	plans: state.plans.filter((plan) => plan.id !== planId),
	loading: false,
	error: null,
});

export const addSubscriptionState = (
	state: SubscriptionUIState,
	subscription: MemberSubscription,
): SubscriptionUIState => ({
	...state,
	subscriptions: [...state.subscriptions, subscription],
	loading: false,
	error: null,
});

export const updateSubscriptionState = (
	state: SubscriptionUIState,
	updatedSubscription: MemberSubscription,
): SubscriptionUIState => ({
	...state,
	subscriptions: state.subscriptions.map((sub) =>
		sub.id === updatedSubscription.id ? updatedSubscription : sub,
	),
	loading: false,
	error: null,
});

// Derived State Functions
export const getDerivedState = (
	state: SubscriptionUIState,
): SubscriptionUIDerivedState => ({
	stats: calculateSubscriptionStats(state.subscriptions),
});
