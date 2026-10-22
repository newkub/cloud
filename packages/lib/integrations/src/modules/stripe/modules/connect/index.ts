// ============================================================================
// Connect Module - Public API
// ============================================================================

// Application Layer
export type { AccountManagementDependencies } from "./application/usecases/account-management";
export {
	createAccount,
	createAccountLink,
	getAccount,
	getAccountBalance,
	getAccounts,
	updateAccount,
} from "./application/usecases/account-management";

// Domain Events
export type {
	AccountCapabilitiesEnabledEvent,
	AccountCreatedEvent,
	AccountSuspendedEvent,
	AccountUpdatedEvent,
	AccountVerifiedEvent,
	BaseDomainEvent,
	ConnectDomainEvent,
	PayoutCompletedEvent,
	PayoutCreatedEvent,
	PayoutFailedEvent,
} from "./domain/events/connect-events";
export {
	createAccountCapabilitiesEnabledEvent,
	createAccountCreatedEvent,
	createAccountSuspendedEvent,
	createAccountUpdatedEvent,
	createAccountVerifiedEvent,
} from "./domain/events/connect-events";

// Domain Operations
export {
	calculateTotalAvailable,
	calculateTotalBalance,
	calculateTotalPending,
	canAcceptPayments,
	canReceivePayouts,
	createConnectedAccount,
	getBalanceByCurrency,
	hasCapability,
	isAccountActive,
	isAccountRestricted,
	isAccountSuspended,
	isAccountVerified,
	isCustomAccount,
	isExpressAccount,
	isStandardAccount,
} from "./domain/operations/account-operations";
export {
	canCreateAccount,
	canCreatePayout,
	canDeleteAccount,
	canEnableCapability,
	canUpdateAccount,
	hasSufficientBalance,
} from "./domain/operations/business-rules";
export {
	validateAccountLinkRequest,
	validateCreateAccountRequest,
	validateUpdateAccountRequest,
} from "./domain/validators/validation";

// Ports
export type {
	ConnectAccountRepository,
	ConnectEventPublisher,
	StripeConnectAdapter,
} from "./ports/connect-repository";

// Domain Types
export type {
	AccountBalance,
	AccountFilters,
	AccountLink,
	AccountLinkRequest,
	AccountStatus,
	AccountType,
	BalanceItem,
	BusinessProfile,
	BusinessType,
	Capability,
	ConnectedAccount,
	CreateAccountRequest,
	Payout,
	PayoutRequest,
	UpdateAccountRequest,
} from "./types";
