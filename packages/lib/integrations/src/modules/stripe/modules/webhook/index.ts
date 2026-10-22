// ============================================================================
// Webhook Module - Public API
// ============================================================================

// Application Layer
export type { WebhookManagementDependencies } from "./application/usecases/webhook-management";
export {
	getWebhookLogs,
	processWebhook,
	registerWebhookHandler,
} from "./application/usecases/webhook-management";

// Domain Events
export type {
	BaseDomainEvent,
	WebhookDomainEvent,
	WebhookFailedEvent,
	WebhookProcessedEvent,
	WebhookReceivedEvent,
} from "./domain/events/webhook-events";
export {
	createWebhookFailedEvent,
	createWebhookProcessedEvent,
	createWebhookReceivedEvent,
} from "./domain/events/webhook-events";

// Domain Operations
export {
	createWebhookEvent,
	getEventData,
	getEventObjectId,
	getEventType,
	isConnectEvent,
	isCustomerEvent,
	isInvoiceEvent,
	isLiveModeEvent,
	isPaymentEvent,
	isRecentEvent,
	isSubscriptionEvent,
	isTestModeEvent,
} from "./domain/operations/webhook-operations";

// Domain Validators
export {
	validateWebhookEvent,
	validateWebhookSignature,
} from "./domain/validators/validation";

// Ports
export type {
	StripeWebhookAdapter,
	WebhookEventPublisher,
	WebhookHandlerRegistry,
	WebhookRepository,
} from "./ports/webhook-repository";

// Domain Types
export type {
	WebhookConfig,
	WebhookEvent,
	WebhookHandler,
	WebhookSignature,
} from "./types";
