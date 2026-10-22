// ============================================================================
// Subscription Module - Member Subscription API Functions
// ============================================================================

import type {
	MemberSubscription,
	SubscribeCustomerRequest,
	SubscriptionFilters,
} from "#modules/subscription/types";
import {
	buildUrl,
	makeRequest,
	makeRequestWithOptional404,
} from "./http-helpers";

export const createSubscription = async (
	request: SubscribeCustomerRequest,
): Promise<MemberSubscription> => {
	const result = await makeRequest<{ data: MemberSubscription }>(
		buildUrl("/subscribe"),
		{
			method: "POST",
			body: JSON.stringify(request),
		},
	);
	return result.data;
};

export const updateSubscription = async (
	id: string,
	data: Partial<MemberSubscription>,
): Promise<MemberSubscription> => {
	const result = await makeRequest<{ data: MemberSubscription }>(
		buildUrl(`/${id}`),
		{
			method: "PATCH",
			body: JSON.stringify(data),
		},
	);
	return result.data;
};

export const deleteSubscription = async (id: string): Promise<void> => {
	await makeRequest(buildUrl(`/${id}`), { method: "DELETE" });
};

export const getSubscription = async (
	id: string,
): Promise<MemberSubscription | null> => {
	const result = await makeRequestWithOptional404<{ data: MemberSubscription }>(
		buildUrl(`/${id}`),
	);
	return result?.data || null;
};

export const getSubscriptionsByCustomer = async (
	customerId: string,
): Promise<readonly MemberSubscription[]> => {
	const result = await makeRequest<{ data: MemberSubscription[] }>(
		buildUrl("", { customerId }),
	);
	return result.data || [];
};

export const getSubscriptionsByPlan = async (
	planId: string,
): Promise<readonly MemberSubscription[]> => {
	const result = await makeRequest<{ data: MemberSubscription[] }>(
		buildUrl("", { planId }),
	);
	return result.data || [];
};

export const getActiveSubscriptions = async (): Promise<
	readonly MemberSubscription[]
> => {
	const result = await makeRequest<{ data: MemberSubscription[] }>(
		buildUrl("", { status: "active" }),
	);
	return result.data || [];
};

export const getSubscriptionsWithFilters = async (
	filters: SubscriptionFilters,
): Promise<readonly MemberSubscription[]> => {
	const result = await makeRequest<{ data: MemberSubscription[] }>(
		buildUrl(
			"",
			filters as Record<string, string | number | boolean | undefined>,
		),
	);
	return result.data || [];
};

export const getAllSubscriptions = async (): Promise<
	readonly MemberSubscription[]
> => {
	const result = await makeRequest<{ data: MemberSubscription[] }>(
		buildUrl(""),
	);
	return result.data || [];
};
