// ============================================================================
// Webhook Module - Domain Validation
// ============================================================================

import type { DomainError } from "../../../../shared/errors/domain-errors";
import { createValidationError } from "../../../../shared/errors/domain-errors";
import type { Result } from "../../../../shared/types/result-either";
import { failure } from "../../../../shared/types/result-either";
import type { WebhookEvent, WebhookSignature } from "../../types";

// Webhook Signature Validation
export const validateWebhookSignature = (
	signature: WebhookSignature,
	_expectedSecret: string,
	tolerance: number,
	now: number,
): Result<true, DomainError> => {
	if (!signature.timestamp) {
		return failure(
			createValidationError(
				"timestamp",
				signature.timestamp,
				"Timestamp is required",
			),
		);
	}

	const eventAge = Math.floor(now / 1000) - signature.timestamp;
	if (eventAge > tolerance) {
		return failure(
			createValidationError(
				"timestamp",
				signature.timestamp,
				`Webhook timestamp is too old (age: ${eventAge}s, tolerance: ${tolerance}s)`,
			),
		);
	}

	if (!signature.signature || signature.signature.trim().length === 0) {
		return failure(
			createValidationError(
				"signature",
				signature.signature,
				"Signature is required",
			),
		);
	}

	return { success: true, data: true };
};

// Webhook Event Validation
export const validateWebhookEvent = (
	event: WebhookEvent,
): Result<WebhookEvent, DomainError> => {
	if (!event.id || event.id.trim().length === 0) {
		return failure(
			createValidationError("id", event.id, "Event ID is required"),
		);
	}

	if (!event.type || event.type.trim().length === 0) {
		return failure(
			createValidationError("type", event.type, "Event type is required"),
		);
	}

	if (!event.data?.object) {
		return failure(
			createValidationError("data", event.data, "Event data is required"),
		);
	}

	if (!(event.data.object as { id: string }).id) {
		return failure(
			createValidationError(
				"data.object.id",
				(event.data.object as { id: string }).id,
				"Object ID is required",
			),
		);
	}

	return { success: true, data: event };
};
