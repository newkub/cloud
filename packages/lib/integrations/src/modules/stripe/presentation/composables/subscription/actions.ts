// ============================================================================
// Subscription Module - UI Action Implementation
// ============================================================================

import type {
	MemberSubscriptionRepository,
	SubscriptionPlanRepository,
} from "#modules/subscription/ports/subscription-repository";
import { createPlanActions } from "./plan-actions";
import { createInitialSubscriptionState } from "./state";
import { createSubscriptionActions } from "./subscription-actions";
import type { SubscriptionUIActions, SubscriptionUIState } from "./types";

export const createSubscriptionUIActions = (
	planRepository: SubscriptionPlanRepository,
	subscriptionRepository: MemberSubscriptionRepository,
): SubscriptionUIActions => {
	const planActions = createPlanActions(planRepository);
	const subscriptionActions = createSubscriptionActions(subscriptionRepository);

	const refreshData = async (
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const [plansState, subscriptionsState] = await Promise.all([
				planActions.fetchPlans(currentState),
				subscriptionActions.fetchSubscriptions(undefined, currentState),
			]);

			return {
				...subscriptionsState,
				plans: plansState.plans,
				loading: false,
				error: null,
			};
		} catch (err) {
			return {
				...currentState,
				loading: false,
				error: err instanceof Error ? err.message : "Failed to refresh data",
			};
		}
	};

	return {
		...planActions,
		...subscriptionActions,
		refreshData,
	};
};
