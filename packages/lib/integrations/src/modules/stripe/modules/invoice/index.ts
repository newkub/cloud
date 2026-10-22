// ============================================================================
// Invoice Module - Public API
// ============================================================================

// Application Layer
export type { InvoiceManagementDependencies } from "./application/usecases/invoice-management";
export {
	createInvoice,
	finalizeInvoice,
	getInvoice,
	getInvoices,
	markUncollectible,
	voidInvoice,
} from "./application/usecases/invoice-management";

// Domain Events
export type {
	BaseDomainEvent,
	InvoiceCreatedEvent,
	InvoiceDomainEvent,
	InvoiceFinalizedEvent,
	InvoiceMarkedUncollectibleEvent,
	InvoicePaidEvent,
	InvoiceVoidedEvent,
} from "./domain/events/invoice-events";
export {
	createInvoiceCreatedEvent,
	createInvoiceFinalizedEvent,
	createInvoiceMarkedUncollectibleEvent,
	createInvoicePaidEvent,
	createInvoiceVoidedEvent,
} from "./domain/events/invoice-events";

// Domain Operations
export {
	calculateDiscountAmount,
	calculateTaxAmount,
	calculateTotalAmount,
	canFinalizeInvoice,
	canMarkUncollectible,
	canVoidInvoice,
	createInvoice as createInvoiceDomain,
	getInvoiceDisplayAmount,
	getInvoiceNumber,
	isInvoiceDraft,
	isInvoiceOpen,
	isInvoiceOverdue,
	isInvoicePaid,
	isInvoiceUncollectible,
	isInvoiceVoid,
} from "./domain/operations/invoice-operations";

// Domain Validators
export { validateCreateInvoiceRequest } from "./domain/validators/validation";

// Ports
export type {
	InvoiceEventPublisher,
	InvoiceRepository,
	StripeInvoiceAdapter,
} from "./ports/invoice-repository";

// Domain Types
export type {
	CreateInvoiceRequest,
	Invoice,
	InvoiceFilters,
	InvoiceItem,
	InvoiceStatus,
} from "./types";
