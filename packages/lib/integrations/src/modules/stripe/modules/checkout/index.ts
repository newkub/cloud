// ============================================================================
// Checkout Module - Public API
// ============================================================================

// Application Layer
export type { CheckoutManagementDependencies } from "./application/usecases/checkout-management";
export {
	completeCheckoutSession,
	createCheckoutSession as createCheckoutSessionApp,
	expireCheckoutSession,
	getCheckoutSession,
	getSessionsByCustomer,
} from "./application/usecases/checkout-management";

// Domain Events
export type {
	BaseDomainEvent,
	CheckoutDomainEvent,
	CheckoutSessionCompletedEvent,
	CheckoutSessionCreatedEvent,
	CheckoutSessionExpiredEvent,
} from "./domain/events/checkout-events";
export {
	createCheckoutSessionCompletedEvent,
	createCheckoutSessionCreatedEvent,
	createCheckoutSessionExpiredEvent,
} from "./domain/events/checkout-events";

// Domain Operations
export {
	calculateTotalAmount,
	createCheckoutSession as createCheckoutSessionDomain,
	getSessionExpiryTime,
	isSessionComplete,
	isSessionExpired,
	isSessionOpen,
	isSessionPaid,
	isSessionValid,
} from "./domain/operations/checkout-operations";

// Domain Validators
export { validateCreateCheckoutSessionRequest } from "./domain/validators/validation";

// Ports
export type {
	CheckoutEventPublisher,
	CheckoutSessionRepository,
	StripeCheckoutAdapter,
} from "./ports/checkout-repository";

// Domain Types
export type {
	CheckoutSession,
	CreateCheckoutSessionRequest,
	LineItem,
} from "./types";
