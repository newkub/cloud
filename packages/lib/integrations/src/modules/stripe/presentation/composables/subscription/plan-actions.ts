// ============================================================================
// Subscription Module - Plan UI Actions
// ============================================================================

import type { SubscriptionPlanRepository } from "#modules/subscription/ports/subscription-repository";
import type { SubscriptionPlan } from "#modules/subscription/types";
import {
	addPlanState,
	createInitialSubscriptionState,
	removePlanState,
	setErrorState,
	setLoadingState,
	setPlansState,
	updatePlanState,
} from "./state";
import type { SubscriptionUIState } from "./types";

type PlanActions = {
	fetchPlans: (
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;
	createPlan: (
		data: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">,
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;
	updatePlan: (
		id: string,
		data: Partial<SubscriptionPlan>,
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;
	deletePlan: (
		id: string,
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;
	togglePlan: (
		id: string,
		isActive: boolean,
		currentState?: SubscriptionUIState,
	) => Promise<SubscriptionUIState>;
};

export const createPlanActions = (
	planRepository: SubscriptionPlanRepository,
): PlanActions => {
	const fetchPlans = async (
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			const plans = await planRepository.getAllPlans();
			return setPlansState(loadingState, plans);
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to fetch plans",
			);
		}
	};

	const createPlan = async (
		data: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			const newPlan = await planRepository.createPlan({
				organizationId: data.organizationId,
				name: data.name,
				description: data.description,
				price: data.price,
				currency: data.currency,
				interval: data.interval,
				intervalCount: data.intervalCount,
				trialDays: data.trialDays,
				features: data.features,
				isPublic: data.isPublic,
				maxMembers: data.maxMembers,
				setupFee: data.setupFee,
			});
			return addPlanState(loadingState, newPlan);
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to create plan",
			);
		}
	};

	const updatePlan = async (
		id: string,
		data: Partial<SubscriptionPlan>,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			const updatedPlan = await planRepository.updatePlan(id, data);
			return updatePlanState(loadingState, updatedPlan);
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to update plan",
			);
		}
	};

	const deletePlan = async (
		id: string,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		try {
			const loadingState = setLoadingState(currentState, true);
			await planRepository.deletePlan(id);
			return removePlanState(loadingState, id);
		} catch (err) {
			return setErrorState(
				currentState,
				err instanceof Error ? err.message : "Failed to delete plan",
			);
		}
	};

	const togglePlan = async (
		id: string,
		isActive: boolean,
		currentState: SubscriptionUIState = createInitialSubscriptionState(),
	): Promise<SubscriptionUIState> => {
		return updatePlan(id, { isActive }, currentState);
	};

	return {
		fetchPlans,
		createPlan,
		updatePlan,
		deletePlan,
		togglePlan,
	};
};
