// ============================================================================
// Webhook Module - Domain Operations (Pure Functions)
// ============================================================================

import type { WebhookEvent } from "../../types";

// Webhook Event Creation
export const createWebhookEvent = (params: {
	id: string;
	type: string;
	data: { object: { id: string; [key: string]: unknown } };
	createdAt: Date;
	livemode: boolean;
}): WebhookEvent => ({
	id: params.id,
	type: params.type,
	data: params.data,
	createdAt: params.createdAt,
	livemode: params.livemode,
});

// Webhook Event Checks
export const isTestModeEvent = (event: WebhookEvent): boolean =>
	!event.livemode;

export const isLiveModeEvent = (event: WebhookEvent): boolean => event.livemode;

export const isRecentEvent = (
	event: WebhookEvent,
	maxAgeSeconds: number,
	now: number,
): boolean => {
	const eventAge =
		Math.floor(now / 1000) - Math.floor(event.createdAt.getTime() / 1000);
	return eventAge <= maxAgeSeconds;
};

// Webhook Event Type Extraction
export const getEventType = (event: WebhookEvent): string => event.type;

export const getEventObjectId = (event: WebhookEvent): string =>
	(event.data.object as { id: string }).id;

export const getEventData = (
	event: WebhookEvent,
): { id: string; [key: string]: unknown } =>
	event.data.object as { id: string; [key: string]: unknown };

// Webhook Event Category
export const isCustomerEvent = (event: WebhookEvent): boolean =>
	event.type.startsWith("customer.");

export const isPaymentEvent = (event: WebhookEvent): boolean =>
	event.type.startsWith("payment_intent.") || event.type.startsWith("charge.");

export const isInvoiceEvent = (event: WebhookEvent): boolean =>
	event.type.startsWith("invoice.");

export const isSubscriptionEvent = (event: WebhookEvent): boolean =>
	event.type.startsWith("customer.subscription.");

export const isConnectEvent = (event: WebhookEvent): boolean =>
	event.type.startsWith("account.") || event.type.startsWith("application.");
