// ============================================================================
// Subscription Module - Domain Events
// ============================================================================

import type { MemberSubscription, SubscriptionPlan } from "../../types";

export interface BaseDomainEvent {
	readonly id: string;
	readonly timestamp: string;
	readonly aggregateId: string;
	readonly eventType: string;
}

export interface PlanCreatedEvent extends BaseDomainEvent {
	readonly eventType: "PlanCreated";
	readonly plan: SubscriptionPlan;
}

export interface PlanUpdatedEvent extends BaseDomainEvent {
	readonly eventType: "PlanUpdated";
	readonly planId: string;
	readonly previousPlan: Partial<SubscriptionPlan>;
	readonly newPlan: SubscriptionPlan;
}

export interface PlanDeletedEvent extends BaseDomainEvent {
	readonly eventType: "PlanDeleted";
	readonly planId: string;
	readonly deletedPlan: SubscriptionPlan;
}

export interface PlanActivatedEvent extends BaseDomainEvent {
	readonly eventType: "PlanActivated";
	readonly planId: string;
	readonly plan: SubscriptionPlan;
}

export interface PlanDeactivatedEvent extends BaseDomainEvent {
	readonly eventType: "PlanDeactivated";
	readonly planId: string;
	readonly plan: SubscriptionPlan;
}

export interface SubscriptionCreatedEvent extends BaseDomainEvent {
	readonly eventType: "SubscriptionCreated";
	readonly subscription: MemberSubscription;
}

export interface SubscriptionActivatedEvent extends BaseDomainEvent {
	readonly eventType: "SubscriptionActivated";
	readonly subscriptionId: string;
	readonly subscription: MemberSubscription;
}

export interface SubscriptionCancelledEvent extends BaseDomainEvent {
	readonly eventType: "SubscriptionCancelled";
	readonly subscriptionId: string;
	readonly subscription: MemberSubscription;
	readonly reason?: string;
}

export interface SubscriptionPausedEvent extends BaseDomainEvent {
	readonly eventType: "SubscriptionPaused";
	readonly subscriptionId: string;
	readonly subscription: MemberSubscription;
}

export interface SubscriptionResumedEvent extends BaseDomainEvent {
	readonly eventType: "SubscriptionResumed";
	readonly subscriptionId: string;
	readonly subscription: MemberSubscription;
}

export interface SubscriptionExpiredEvent extends BaseDomainEvent {
	readonly eventType: "SubscriptionExpired";
	readonly subscriptionId: string;
	readonly subscription: MemberSubscription;
}

export interface TrialStartedEvent extends BaseDomainEvent {
	readonly eventType: "TrialStarted";
	readonly subscriptionId: string;
	readonly subscription: MemberSubscription;
	readonly trialEndDate: string;
}

export interface TrialEndedEvent extends BaseDomainEvent {
	readonly eventType: "TrialEnded";
	readonly subscriptionId: string;
	readonly subscription: MemberSubscription;
	readonly convertedToPaid: boolean;
}

export type SubscriptionDomainEvent =
	| PlanCreatedEvent
	| PlanUpdatedEvent
	| PlanDeletedEvent
	| PlanActivatedEvent
	| PlanDeactivatedEvent
	| SubscriptionCreatedEvent
	| SubscriptionActivatedEvent
	| SubscriptionCancelledEvent
	| SubscriptionPausedEvent
	| SubscriptionResumedEvent
	| SubscriptionExpiredEvent
	| TrialStartedEvent
	| TrialEndedEvent;

// Event factory functions
export const createPlanCreatedEvent = (
	plan: SubscriptionPlan,
	id: string,
	timestamp: string,
): PlanCreatedEvent => ({
	id,
	timestamp,
	aggregateId: plan.id,
	eventType: "PlanCreated",
	plan,
});

export const createPlanUpdatedEvent = (
	planId: string,
	previousPlan: Partial<SubscriptionPlan>,
	newPlan: SubscriptionPlan,
	id: string,
	timestamp: string,
): PlanUpdatedEvent => ({
	id,
	timestamp,
	aggregateId: planId,
	eventType: "PlanUpdated",
	planId,
	previousPlan,
	newPlan,
});

export const createPlanDeletedEvent = (
	plan: SubscriptionPlan,
	id: string,
	timestamp: string,
): PlanDeletedEvent => ({
	id,
	timestamp,
	aggregateId: plan.id,
	eventType: "PlanDeleted",
	planId: plan.id,
	deletedPlan: plan,
});

export const createSubscriptionCreatedEvent = (
	subscription: MemberSubscription,
	id: string,
	timestamp: string,
): SubscriptionCreatedEvent => ({
	id,
	timestamp,
	aggregateId: subscription.id,
	eventType: "SubscriptionCreated",
	subscription,
});

export const createSubscriptionCancelledEvent = (
	subscription: MemberSubscription,
	reason: string | undefined,
	id: string,
	timestamp: string,
): SubscriptionCancelledEvent => ({
	id,
	timestamp,
	aggregateId: subscription.id,
	eventType: "SubscriptionCancelled",
	subscriptionId: subscription.id,
	subscription,
	reason,
});
