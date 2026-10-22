// ============================================================================
// Webhook Module - Domain Events
// ============================================================================

import type { WebhookEvent } from "../../types";

// Base event type
export interface BaseDomainEvent {
	readonly eventType: string;
	readonly aggregateId: string;
	readonly occurredAt: Date;
	readonly version: number;
}

// Webhook Events
export interface WebhookReceivedEvent extends BaseDomainEvent {
	readonly eventType: "WebhookReceived";
	readonly aggregateId: string;
	readonly webhookId: string;
	readonly stripeEventType: string;
	readonly objectId: string;
	readonly receivedAt: Date;
}

export interface WebhookProcessedEvent extends BaseDomainEvent {
	readonly eventType: "WebhookProcessed";
	readonly aggregateId: string;
	readonly webhookId: string;
	readonly stripeEventType: string;
	readonly objectId: string;
	readonly processedAt: Date;
	readonly success: boolean;
}

export interface WebhookFailedEvent extends BaseDomainEvent {
	readonly eventType: "WebhookFailed";
	readonly aggregateId: string;
	readonly webhookId: string;
	readonly stripeEventType: string;
	readonly reason: string;
	readonly failedAt: Date;
}

// Union type for all webhook events
export type WebhookDomainEvent =
	| WebhookReceivedEvent
	| WebhookProcessedEvent
	| WebhookFailedEvent;

// Event constructors
export const createWebhookReceivedEvent = (
	webhookEvent: WebhookEvent,
	receivedAt: Date,
	occurredAt: Date,
): WebhookReceivedEvent => ({
	eventType: "WebhookReceived",
	aggregateId: webhookEvent.id,
	webhookId: webhookEvent.id,
	stripeEventType: webhookEvent.type,
	objectId: (webhookEvent.data.object as { id: string }).id,
	receivedAt,
	occurredAt,
	version: 1,
});

export const createWebhookProcessedEvent = (
	webhookEvent: WebhookEvent,
	success: boolean,
	processedAt: Date,
	occurredAt: Date,
): WebhookProcessedEvent => ({
	eventType: "WebhookProcessed",
	aggregateId: webhookEvent.id,
	webhookId: webhookEvent.id,
	stripeEventType: webhookEvent.type,
	objectId: (webhookEvent.data.object as { id: string }).id,
	processedAt,
	success,
	occurredAt,
	version: 1,
});

export const createWebhookFailedEvent = (
	webhookEvent: WebhookEvent,
	reason: string,
	failedAt: Date,
	occurredAt: Date,
): WebhookFailedEvent => ({
	eventType: "WebhookFailed",
	aggregateId: webhookEvent.id,
	webhookId: webhookEvent.id,
	stripeEventType: webhookEvent.type,
	reason,
	failedAt,
	occurredAt,
	version: 1,
});
