// ============================================================================
// Subscription Module - Repository Ports
// ============================================================================

import type {
	CreatePlanRequest,
	MemberSubscription,
	SubscribeCustomerRequest,
	SubscriptionFilters,
	SubscriptionPlan,
	UpdatePlanRequest,
} from "../types";

export interface SubscriptionPlanRepository {
	// Plan CRUD operations
	createPlan(request: CreatePlanRequest): Promise<SubscriptionPlan>;
	updatePlan(id: string, request: UpdatePlanRequest): Promise<SubscriptionPlan>;
	deletePlan(id: string): Promise<void>;
	getPlan(id: string): Promise<SubscriptionPlan | null>;
	getPlansByOrganization(
		organizationId: string,
	): Promise<readonly SubscriptionPlan[]>;
	getAllPlans(): Promise<readonly SubscriptionPlan[]>;
	getActivePlans(): Promise<readonly SubscriptionPlan[]>;
	getPublicPlans(): Promise<readonly SubscriptionPlan[]>;
}

export interface MemberSubscriptionRepository {
	// Subscription CRUD operations
	createSubscription(
		request: SubscribeCustomerRequest,
	): Promise<MemberSubscription>;
	updateSubscription(
		id: string,
		data: Partial<MemberSubscription>,
	): Promise<MemberSubscription>;
	deleteSubscription(id: string): Promise<void>;
	getSubscription(id: string): Promise<MemberSubscription | null>;
	getSubscriptionsByCustomer(
		customerId: string,
	): Promise<readonly MemberSubscription[]>;
	getSubscriptionsByPlan(
		planId: string,
	): Promise<readonly MemberSubscription[]>;
	getActiveSubscriptions(): Promise<readonly MemberSubscription[]>;
	getSubscriptionsWithFilters(
		filters: SubscriptionFilters,
	): Promise<readonly MemberSubscription[]>;
	getAllSubscriptions(): Promise<readonly MemberSubscription[]>;
}

export interface SubscriptionEventPublisher {
	publish(event: unknown): Promise<void>;
	publishBatch(events: readonly unknown[]): Promise<void>;
}

export interface PaymentGatewayAdapter {
	processPayment(
		amount: number,
		currency: string,
		paymentMethod: string,
	): Promise<{ success: boolean; transactionId?: string; error?: string }>;
	refundPayment(
		transactionId: string,
		amount?: number,
	): Promise<{ success: boolean; refundId?: string; error?: string }>;
	createPaymentIntent(
		amount: number,
		currency: string,
		customerId: string,
	): Promise<{ clientSecret: string; paymentIntentId: string }>;
}

export interface NotificationServiceAdapter {
	sendSubscriptionConfirmation(subscription: MemberSubscription): Promise<void>;
	sendSubscriptionCancellation(
		subscription: MemberSubscription,
		reason?: string,
	): Promise<void>;
	sendPaymentFailed(subscription: MemberSubscription): Promise<void>;
	sendTrialEnding(subscription: MemberSubscription): Promise<void>;
}

export interface AuditLogAdapter {
	logPlanCreated(plan: SubscriptionPlan, createdBy: string): Promise<void>;
	logPlanUpdated(
		planId: string,
		changes: Partial<SubscriptionPlan>,
		updatedBy: string,
	): Promise<void>;
	logPlanDeleted(planId: string, deletedBy: string): Promise<void>;
	logSubscriptionCreated(
		subscription: MemberSubscription,
		createdBy: string,
	): Promise<void>;
	logSubscriptionCancelled(
		subscription: MemberSubscription,
		reason?: string,
		cancelledBy?: string,
	): Promise<void>;
}
