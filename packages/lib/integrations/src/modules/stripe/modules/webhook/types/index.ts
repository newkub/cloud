// ============================================================================
// Webhook Module - Domain Types
// ============================================================================

import type { AsyncResult, Result } from "#shared/types/result-either";
import type { WebhookEvent, WebhookSignature } from "../domain/models";

// Re-export domain models
export type { WebhookEvent, WebhookSignature };

// Webhook Config
export interface WebhookConfig {
	readonly secret: string;
	readonly tolerance: number;
	readonly endpointSecret: string;
}

// Webhook Handler
export interface WebhookHandler {
	readonly eventType: string;
	readonly handle: (event: WebhookEvent) => AsyncResult<void, Error>;
}

// Validation
export type ValidationResult = Result<unknown, Error>;
