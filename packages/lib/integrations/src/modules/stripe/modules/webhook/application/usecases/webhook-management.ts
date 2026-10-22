// ============================================================================
// Webhook Module - Application Layer - Webhook Management
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import { success } from "#shared/types/result-either";
import {
	createWebhookFailedEvent,
	createWebhookProcessedEvent,
	createWebhookReceivedEvent,
} from "../../domain/events/webhook-events";
import {
	validateWebhookEvent,
	validateWebhookSignature,
} from "../../domain/validators/validation";
import type {
	StripeWebhookAdapter,
	WebhookHandlerRegistry,
	WebhookRepository,
} from "../../ports/webhook-repository";
import type { WebhookEvent, WebhookSignature } from "../../types";

// Dependencies
export interface WebhookManagementDependencies {
	readonly repository: WebhookRepository;
	readonly stripeAdapter: StripeWebhookAdapter;
	readonly handlerRegistry: WebhookHandlerRegistry;
	readonly eventPublisher?: {
		publish(event: unknown): AsyncResult<void, Error>;
	};
	readonly config: {
		readonly secret: string;
		readonly tolerance: number;
	};
}

// Process Webhook
export const processWebhook = async (
	payload: string,
	signature: string,
	dependencies: WebhookManagementDependencies,
	now: number,
): AsyncResult<void, Error> => {
	// Parse signature
	const webhookSignature: WebhookSignature = {
		timestamp: parseInt(signature.split(",")[0].split("=")[1], 10),
		signature: signature.split(",")[1].split("=")[1],
	};

	// Validate signature
	const signatureValidation = validateWebhookSignature(
		webhookSignature,
		dependencies.config.secret,
		dependencies.config.tolerance,
		now,
	);
	if (!signatureValidation.success) {
		return {
			success: false,
			error: new Error(signatureValidation.error.message),
		};
	}

	// Construct event via Stripe
	const stripeResult = await dependencies.stripeAdapter.constructEvent(
		payload,
		signature,
		dependencies.config.secret,
	);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Validate event
	const eventValidation = validateWebhookEvent(stripeResult.data);
	if (!eventValidation.success) {
		return {
			success: false,
			error: new Error(eventValidation.error.message),
		};
	}

	// Log webhook
	await dependencies.repository.logWebhook(stripeResult.data);

	const nowDate = new Date(now);

	// Publish received event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createWebhookReceivedEvent(stripeResult.data, nowDate, nowDate),
		);
	}

	// Get handler for event type
	const handler = dependencies.handlerRegistry.getHandler(
		stripeResult.data.type,
	);
	if (!handler) {
		// No handler registered, but event is valid
		if (dependencies.eventPublisher) {
			await dependencies.eventPublisher.publish(
				createWebhookProcessedEvent(stripeResult.data, true, nowDate, nowDate),
			);
		}
		return success(undefined);
	}

	// Execute handler
	const handlerResult = await handler.handle(stripeResult.data);
	if (!handlerResult.success) {
		// Publish failed event
		if (dependencies.eventPublisher) {
			await dependencies.eventPublisher.publish(
				createWebhookFailedEvent(
					stripeResult.data,
					(handlerResult as { error: Error }).error.message,
					nowDate,
					nowDate,
				),
			);
		}
		return handlerResult;
	}

	// Publish processed event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createWebhookProcessedEvent(stripeResult.data, true, nowDate, nowDate),
		);
	}

	return success(undefined);
};

// Register Handler
export const registerWebhookHandler = (
	handler: {
		eventType: string;
		handle: (event: WebhookEvent) => AsyncResult<void, Error>;
	},
	dependencies: WebhookManagementDependencies,
): void => {
	dependencies.handlerRegistry.registerHandler(handler);
};

// Get Webhook Logs
export const getWebhookLogs = async (
	dependencies: WebhookManagementDependencies,
	filters?: { eventType?: string; limit?: number },
): AsyncResult<readonly WebhookEvent[], Error> => {
	return dependencies.repository.getWebhookLogs(filters);
};
