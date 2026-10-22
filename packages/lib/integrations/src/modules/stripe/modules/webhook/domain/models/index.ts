// ============================================================================
// Webhook Module - Domain Models (Readonly Data Models)
// ============================================================================

// Webhook Event Model
export interface WebhookEvent {
	readonly id: string;
	readonly type: string;
	readonly data: WebhookEventData;
	readonly createdAt: Date;
	readonly livemode: boolean;
}

// Webhook Event Data
export interface WebhookEventData {
	readonly object: unknown;
}

// Webhook Signature Model
export interface WebhookSignature {
	readonly timestamp: number;
	readonly signature: string;
}
