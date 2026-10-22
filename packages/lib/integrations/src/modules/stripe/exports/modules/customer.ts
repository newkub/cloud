// ============================================================================
// Customer Module Exports
// ============================================================================

export type {
	BaseDomainEvent as CustomerBaseDomainEvent,
	CreateCustomerRequest,
	Customer,
	CustomerCreatedEvent,
	CustomerDeletedEvent,
	CustomerDomainEvent,
	CustomerEventPublisher,
	CustomerFilters,
	CustomerPaymentMethodAddedEvent,
	CustomerPaymentMethodRemovedEvent,
	CustomerRepository,
	CustomerUpdatedEvent,
	StripeCustomerAdapter,
	UpdateCustomerRequest,
} from "#modules/customer";
export {
	createCustomer,
	createCustomerCreatedEvent,
	createCustomerDeletedEvent,
	createCustomerPaymentMethodAddedEvent,
	createCustomerPaymentMethodRemovedEvent,
	createCustomerUpdatedEvent,
	getCustomerDisplayName,
	getCustomerInitials,
	hasActiveSubscriptions,
	hasPaymentMethods,
	isValidCustomerEmail,
	isValidCustomerPhone,
	validateCreateCustomerRequest,
	validateUpdateCustomerRequest,
} from "#modules/customer";
