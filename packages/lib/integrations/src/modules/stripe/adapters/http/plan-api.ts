// ============================================================================
// Subscription Module - Plan API Functions
// ============================================================================

import type {
	CreatePlanRequest,
	SubscriptionPlan,
	UpdatePlanRequest,
} from "#modules/subscription/types";
import {
	buildUrl,
	makeRequest,
	makeRequestWithOptional404,
} from "./http-helpers";

export const createPlan = async (
	request: CreatePlanRequest,
): Promise<SubscriptionPlan> => {
	const result = await makeRequest<{ data: SubscriptionPlan }>(
		buildUrl("/plans"),
		{
			method: "POST",
			body: JSON.stringify(request),
		},
	);
	return result.data;
};

export const updatePlan = async (
	id: string,
	request: UpdatePlanRequest,
): Promise<SubscriptionPlan> => {
	const result = await makeRequest<{ data: SubscriptionPlan }>(
		buildUrl(`/plans/${id}`),
		{
			method: "PATCH",
			body: JSON.stringify(request),
		},
	);
	return result.data;
};

export const deletePlan = async (id: string): Promise<void> => {
	await makeRequest(buildUrl(`/plans/${id}`), { method: "DELETE" });
};

export const getPlan = async (id: string): Promise<SubscriptionPlan | null> => {
	const result = await makeRequestWithOptional404<{ data: SubscriptionPlan }>(
		buildUrl(`/plans/${id}`),
	);
	return result?.data || null;
};

export const getPlansByOrganization = async (
	organizationId: string,
): Promise<readonly SubscriptionPlan[]> => {
	const result = await makeRequest<{ data: SubscriptionPlan[] }>(
		buildUrl("/plans", { organizationId }),
	);
	return result.data || [];
};

export const getAllPlans = async (): Promise<readonly SubscriptionPlan[]> => {
	const result = await makeRequest<{ data: SubscriptionPlan[] }>(
		buildUrl("/plans"),
	);
	return result.data || [];
};

export const getActivePlans = async (): Promise<
	readonly SubscriptionPlan[]
> => {
	const result = await makeRequest<{ data: SubscriptionPlan[] }>(
		buildUrl("/plans", { isActive: true }),
	);
	return result.data || [];
};

export const getPublicPlans = async (): Promise<
	readonly SubscriptionPlan[]
> => {
	const result = await makeRequest<{ data: SubscriptionPlan[] }>(
		buildUrl("/plans", { isPublic: true }),
	);
	return result.data || [];
};
