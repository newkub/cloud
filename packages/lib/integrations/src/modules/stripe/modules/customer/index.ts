// ============================================================================
// Customer Module - Public API
// ============================================================================

// Application Layer
export type { CustomerManagementDependencies } from "./application/usecases/customer-management";
export {
	createCustomer,
	deleteCustomer,
	getCustomer,
	getCustomers,
	updateCustomer,
} from "./application/usecases/customer-management";

// Domain Events
export type {
	BaseDomainEvent,
	CustomerCreatedEvent,
	CustomerDeletedEvent,
	CustomerDomainEvent,
	CustomerPaymentMethodAddedEvent,
	CustomerPaymentMethodRemovedEvent,
	CustomerUpdatedEvent,
} from "./domain/events/customer-events";
export {
	createCustomerCreatedEvent,
	createCustomerDeletedEvent,
	createCustomerPaymentMethodAddedEvent,
	createCustomerPaymentMethodRemovedEvent,
	createCustomerUpdatedEvent,
} from "./domain/events/customer-events";

// Domain Operations
export {
	createCustomer as createCustomerDomain,
	getCustomerDisplayName,
	getCustomerInitials,
	hasActiveSubscriptions,
	hasPaymentMethods,
	isValidCustomerEmail,
	isValidCustomerPhone,
} from "./domain/operations/customer-operations";

// Domain Validators
export {
	validateCreateCustomerRequest,
	validateUpdateCustomerRequest,
} from "./domain/validators/validation";

// Ports
export type {
	CustomerEventPublisher,
	CustomerRepository,
	StripeCustomerAdapter,
} from "./ports/customer-repository";

// Domain Types
export type {
	CreateCustomerRequest,
	Customer,
	CustomerFilters,
	UpdateCustomerRequest,
} from "./types";
