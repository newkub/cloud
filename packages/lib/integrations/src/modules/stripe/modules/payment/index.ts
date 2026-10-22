// ============================================================================
// Payment Module - Public API
// ============================================================================

// Application Layer
export type { PaymentManagementDependencies } from "./application/usecases/payment-management";
export {
	cancelPaymentIntent,
	confirmPayment,
	createPaymentIntent,
	createRefund,
	getPaymentIntent,
	getPaymentIntentsByCustomer,
	getRefunds,
} from "./application/usecases/payment-management";

// Domain Events
export type {
	BaseDomainEvent,
	PaymentDomainEvent,
	PaymentIntentCanceledEvent,
	PaymentIntentCreatedEvent,
	PaymentIntentFailedEvent,
	PaymentIntentSucceededEvent,
	RefundCreatedEvent,
	RefundSucceededEvent,
} from "./domain/events/payment-events";
export {
	createPaymentIntentCreatedEvent,
	createPaymentIntentFailedEvent,
	createPaymentIntentSucceededEvent,
	createRefundCreatedEvent,
	createRefundSucceededEvent,
} from "./domain/events/payment-events";

// Domain Operations
export {
	calculateRefundableAmount,
	canRefundFullAmount,
	canRefundPartialAmount,
	getPaymentMethodDescription,
	isCardPaymentMethod,
	isPaymentIntentActionable,
	isPaymentIntentCanceled,
	isPaymentIntentFailed,
	isPaymentIntentPending,
	isPaymentIntentProcessing,
	isPaymentIntentSucceeded,
} from "./domain/operations/payment-operations";

// Domain Validators
export {
	validateConfirmPaymentRequest,
	validateCreatePaymentIntentRequest,
	validateRefundRequest,
} from "./domain/validators/validation";

// Ports
export type {
	PaymentEventPublisher,
	PaymentRepository,
	StripePaymentAdapter,
} from "./ports/payment-repository";

// Domain Types
export type {
	ConfirmPaymentRequest,
	CreatePaymentIntentRequest,
	PaymentIntent,
	PaymentIntentStatus,
	PaymentMethod,
	Refund,
	RefundRequest,
} from "./types";
