// ============================================================================
// Webhook Module - Ports (Interfaces)
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import type { WebhookEvent, WebhookHandler } from "../types";

// Repository Port
export interface WebhookRepository {
	logWebhook(event: WebhookEvent): AsyncResult<void, Error>;
	getWebhookLogs(filters?: {
		eventType?: string;
		limit?: number;
	}): AsyncResult<readonly WebhookEvent[], Error>;
}

// Event Publisher Port
export interface WebhookEventPublisher {
	publish(event: {
		eventType: string;
		[key: string]: unknown;
	}): AsyncResult<void, Error>;
}

// Stripe Adapter Port
export interface StripeWebhookAdapter {
	constructEvent(
		payload: string,
		signature: string,
		secret: string,
	): AsyncResult<WebhookEvent, Error>;
}

// Handler Registry Port
export interface WebhookHandlerRegistry {
	registerHandler(handler: WebhookHandler): void;
	getHandler(eventType: string): WebhookHandler | undefined;
	getAllHandlers(): readonly WebhookHandler[];
}
