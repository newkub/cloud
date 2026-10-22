// ============================================================================
// Subscription Module - Subscription UI Actions
// ============================================================================

import type { MemberSubscriptionRepository } from "#modules/subscription/ports/subscription-repository";
import type { SubscriptionFilters } from "#modules/subscription/types";
import {
	addSubscriptionState,
	createInitialSubscriptionState,
	setErrorState,
	setLoadingState,
	setSubscriptionsState,
	updateSubscriptionState,
} from "./state";
import type { SubscriptionUIState } from "./types";

type SubscriptionActions = {
	fetchSubscriptions: (
		filters?: SubscriptionFilters,
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;
	subscribeCustomer: (
		customerId: string,
		planId: string,
		paymentMethod?: string,
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;

	cancelSubscription: (
		subscriptionId: string,
		reason?: string,
		currentState?: SubscriptionUIState,
		now?: number,
	) => Promise<SubscriptionUIState>;

	pauseSubscription: (
		subscriptionId: string,
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;

	resumeSubscription: (
		subscriptionId: string,
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;

	refreshData: (
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;
};

export const createSubscriptionActions = (
	subscriptionRepository: MemberSubscriptionRepository,
): SubscriptionActions => {
	const fetchSubscriptions = async (
		filters?: SubscriptionFilters,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			const subscriptions = filters
				? await subscriptionRepository.getSubscriptionsWithFilters(filters)
				: await subscriptionRepository.getAllSubscriptions();
			return setSubscriptionsState(loadingState, subscriptions);
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to fetch subscriptions",
			);
		}
	};

	const subscribeCustomer = async (
		customerId: string,
		planId: string,
		paymentMethod?: string,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			const subscription = await subscriptionRepository.createSubscription({
				customerId,
				planId,
				paymentMethod,
			});
			return addSubscriptionState(loadingState, subscription);
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to create subscription",
			);
		}
	};

	const cancelSubscription = async (
		subscriptionId: string,
		_reason?: string,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
		now: number = Date.now(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			await subscriptionRepository.updateSubscription(subscriptionId, {
				status: "cancelled",
				cancelledAt: new Date(now).toISOString(),
			});

			const updatedSubscription = currentState.subscriptions.find(
				(sub) => sub.id === subscriptionId,
			);
			if (updatedSubscription) {
				const cancelledSubscription = {
					...updatedSubscription,
					status: "cancelled" as const,
					cancelledAt: new Date(now).toISOString(),
				};
				return updateSubscriptionState(loadingState, cancelledSubscription);
			}

			return loadingState;
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to cancel subscription",
			);
		}
	};

	const pauseSubscription = async (
		subscriptionId: string,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			await subscriptionRepository.updateSubscription(subscriptionId, {
				status: "paused",
			});

			const updatedSubscription = currentState.subscriptions.find(
				(sub) => sub.id === subscriptionId,
			);
			if (updatedSubscription) {
				const pausedSubscription = {
					...updatedSubscription,
					status: "paused" as const,
				};
				return updateSubscriptionState(loadingState, pausedSubscription);
			}

			return loadingState;
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to pause subscription",
			);
		}
	};

	const resumeSubscription = async (
		subscriptionId: string,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			await subscriptionRepository.updateSubscription(subscriptionId, {
				status: "active",
			});

			const updatedSubscription = currentState.subscriptions.find(
				(sub) => sub.id === subscriptionId,
			);
			if (updatedSubscription) {
				const activeSubscription = {
					...updatedSubscription,
					status: "active" as const,
				};
				return updateSubscriptionState(loadingState, activeSubscription);
			}

			return loadingState;
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to resume subscription",
			);
		}
	};

	const refreshData = async (
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			const subscriptions = await subscriptionRepository.getAllSubscriptions();

			return {
				...loadingState,
				subscriptions,
				loading: false,
				error: null,
			};
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to refresh data",
			);
		}
	};

	return {
		fetchSubscriptions,
		subscribeCustomer,
		cancelSubscription,
		pauseSubscription,
		resumeSubscription,
		refreshData,
	};
};
