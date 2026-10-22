// ============================================================================
// Checkout Module - Domain Events
// ============================================================================

import type { CheckoutSession } from "../../types";

// Base event type
export interface BaseDomainEvent {
	readonly eventType: string;
	readonly aggregateId: string;
	readonly occurredAt: Date;
	readonly version: number;
}

// Checkout Events
export interface CheckoutSessionCreatedEvent extends BaseDomainEvent {
	readonly eventType: "CheckoutSessionCreated";
	readonly aggregateId: string;
	readonly sessionId: string;
	readonly amountTotal: number;
	readonly currency: string;
	readonly customerId?: string;
}

export interface CheckoutSessionCompletedEvent extends BaseDomainEvent {
	readonly eventType: "CheckoutSessionCompleted";
	readonly aggregateId: string;
	readonly sessionId: string;
	readonly customerId?: string;
	readonly subscriptionId?: string;
	readonly completedAt: Date;
}

export interface CheckoutSessionExpiredEvent extends BaseDomainEvent {
	readonly eventType: "CheckoutSessionExpired";
	readonly aggregateId: string;
	readonly sessionId: string;
	readonly expiredAt: Date;
}

// Union type for all checkout events
export type CheckoutDomainEvent =
	| CheckoutSessionCreatedEvent
	| CheckoutSessionCompletedEvent
	| CheckoutSessionExpiredEvent;

// Event constructors
export const createCheckoutSessionCreatedEvent = (
	session: CheckoutSession,
	now: number = Date.now(),
): CheckoutSessionCreatedEvent => ({
	eventType: "CheckoutSessionCreated",
	aggregateId: session.id,
	sessionId: session.id,
	amountTotal: session.amountTotal,
	currency: session.currency,
	customerId: session.customerId,
	occurredAt: new Date(now),
	version: 1,
});

export const createCheckoutSessionCompletedEvent = (
	session: CheckoutSession,
	now: number = Date.now(),
): CheckoutSessionCompletedEvent => ({
	eventType: "CheckoutSessionCompleted",
	aggregateId: session.id,
	sessionId: session.id,
	customerId: session.customerId,
	subscriptionId: session.subscriptionId,
	completedAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});

export const createCheckoutSessionExpiredEvent = (
	session: CheckoutSession,
	now: number = Date.now(),
): CheckoutSessionExpiredEvent => ({
	eventType: "CheckoutSessionExpired",
	aggregateId: session.id,
	sessionId: session.id,
	expiredAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});
