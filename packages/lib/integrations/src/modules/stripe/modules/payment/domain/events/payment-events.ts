// ============================================================================
// Payment Module - Domain Events
// ============================================================================

import type { PaymentIntent, Refund } from "../../types";

// Base event type
export interface BaseDomainEvent {
	readonly eventType: string;
	readonly aggregateId: string;
	readonly occurredAt: Date;
	readonly version: number;
}

// Payment Events
export interface PaymentIntentCreatedEvent extends BaseDomainEvent {
	readonly eventType: "PaymentIntentCreated";
	readonly aggregateId: string;
	readonly paymentIntentId: string;
	readonly amount: number;
	readonly currency: string;
	readonly customerId?: string;
}

export interface PaymentIntentSucceededEvent extends BaseDomainEvent {
	readonly eventType: "PaymentIntentSucceeded";
	readonly aggregateId: string;
	readonly paymentIntentId: string;
	readonly amount: number;
	readonly currency: string;
	readonly customerId?: string;
	readonly succeededAt: Date;
}

export interface PaymentIntentFailedEvent extends BaseDomainEvent {
	readonly eventType: "PaymentIntentFailed";
	readonly aggregateId: string;
	readonly paymentIntentId: string;
	readonly reason: string;
	readonly failedAt: Date;
}

export interface PaymentIntentCanceledEvent extends BaseDomainEvent {
	readonly eventType: "PaymentIntentCanceled";
	readonly aggregateId: string;
	readonly paymentIntentId: string;
	readonly canceledAt: Date;
}

export interface RefundCreatedEvent extends BaseDomainEvent {
	readonly eventType: "RefundCreated";
	readonly aggregateId: string;
	readonly refundId: string;
	readonly paymentIntentId: string;
	readonly amount: number;
	readonly currency: string;
	readonly reason?: string;
}

export interface RefundSucceededEvent extends BaseDomainEvent {
	readonly eventType: "RefundSucceeded";
	readonly aggregateId: string;
	readonly refundId: string;
	readonly paymentIntentId: string;
	readonly amount: number;
	readonly currency: string;
	readonly succeededAt: Date;
}

// Union type for all payment events
export type PaymentDomainEvent =
	| PaymentIntentCreatedEvent
	| PaymentIntentSucceededEvent
	| PaymentIntentFailedEvent
	| PaymentIntentCanceledEvent
	| RefundCreatedEvent
	| RefundSucceededEvent;

// Event constructors
export const createPaymentIntentCreatedEvent = (
	payment: PaymentIntent,
	now: number = Date.now(),
): PaymentIntentCreatedEvent => ({
	eventType: "PaymentIntentCreated",
	aggregateId: payment.id,
	paymentIntentId: payment.id,
	amount: payment.amount,
	currency: payment.currency,
	customerId: payment.customerId,
	occurredAt: new Date(now),
	version: 1,
});

export const createPaymentIntentSucceededEvent = (
	payment: PaymentIntent,
	now: number = Date.now(),
): PaymentIntentSucceededEvent => ({
	eventType: "PaymentIntentSucceeded",
	aggregateId: payment.id,
	paymentIntentId: payment.id,
	amount: payment.amount,
	currency: payment.currency,
	customerId: payment.customerId,
	succeededAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});

export const createPaymentIntentFailedEvent = (
	payment: PaymentIntent,
	reason: string,
	now: number = Date.now(),
): PaymentIntentFailedEvent => ({
	eventType: "PaymentIntentFailed",
	aggregateId: payment.id,
	paymentIntentId: payment.id,
	reason,
	failedAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});

export const createRefundCreatedEvent = (
	refund: Refund,
	now: number = Date.now(),
): RefundCreatedEvent => ({
	eventType: "RefundCreated",
	aggregateId: refund.id,
	refundId: refund.id,
	paymentIntentId: refund.paymentIntentId,
	amount: refund.amount,
	currency: refund.currency,
	reason: refund.reason,
	occurredAt: new Date(now),
	version: 1,
});

export const createRefundSucceededEvent = (
	refund: Refund,
	now: number = Date.now(),
): RefundSucceededEvent => ({
	eventType: "RefundSucceeded",
	aggregateId: refund.id,
	refundId: refund.id,
	paymentIntentId: refund.paymentIntentId,
	amount: refund.amount,
	currency: refund.currency,
	succeededAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});
