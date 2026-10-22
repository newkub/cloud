// ============================================================================
// Subscription Module - Public API
// ============================================================================

// Presentation Layer
export {
	createInitialSubscriptionState,
	createSubscriptionUIActions,
	type SubscriptionUIActions,
	type SubscriptionUIDerivedState,
	type SubscriptionUIState,
} from "../../presentation/composables/use";
// Application Layer - Plan Management
export type { PlanManagementDependencies } from "./application/usecases/plan-management";
export {
	createPlan,
	deletePlan,
	getActivePlans,
	getAllPlans,
	getPlan,
	getPlansByOrganization,
	togglePlanStatus,
	updatePlan,
} from "./application/usecases/plan-management";
// Application Layer - Subscription Management
export type { SubscriptionManagementDependencies } from "./application/usecases/subscription-management";
export {
	cancelSubscription,
	getActiveSubscriptions,
	getAllSubscriptions,
	getSubscription,
	getSubscriptionsByCustomer,
	getSubscriptionsWithFilters,
	pauseSubscription,
	processExpiringTrials,
	resumeSubscription,
	subscribeCustomer,
} from "./application/usecases/subscription-management";
// Application Layer - Workflows
export type {
	ChangeSubscriptionPlanRequest,
	RenewSubscriptionRequest,
	SubscriptionWorkflowDependencies,
} from "./application/workflows/subscription-workflow";
export {
	changeSubscriptionPlan,
	processFailedPayments,
	renewSubscription,
} from "./application/workflows/subscription-workflow";
// Domain Events
export type {
	BaseDomainEvent,
	PlanActivatedEvent,
	PlanCreatedEvent,
	PlanDeactivatedEvent,
	PlanDeletedEvent,
	PlanUpdatedEvent,
	SubscriptionActivatedEvent,
	SubscriptionCancelledEvent,
	SubscriptionCreatedEvent,
	SubscriptionDomainEvent,
	SubscriptionExpiredEvent,
	SubscriptionPausedEvent,
	SubscriptionResumedEvent,
	TrialEndedEvent,
	TrialStartedEvent,
} from "./domain/events/subscription-events";
export {
	createPlanCreatedEvent,
	createPlanDeletedEvent,
	createPlanUpdatedEvent,
	createSubscriptionCancelledEvent,
	createSubscriptionCreatedEvent,
} from "./domain/events/subscription-events";
export {
	calculateProrationAmount,
	calculateRefundAmount,
	canDowngradePlan,
	canPauseSubscription,
	canUpgradePlan,
	getSubscriptionRenewalDate,
	isSubscriptionWithinGracePeriod,
	isTrialExpired,
} from "./domain/operations/business-rules";
// Domain Operations
export {
	calculateMonthlyEquivalent,
	calculateSubscriptionCost,
	calculateSubscriptionStats,
	createSubscriptionPlan,
	getSubscriptionEndDate,
	isPlanActive,
	isPlanEligibleForTrial,
	isSubscriptionActive,
	isSubscriptionCancelled,
} from "./domain/operations/subscription-operations";
// Domain Validators
export {
	validateCancelSubscriptionRequest,
	validateCreatePlanRequest,
	validatePlanTransition,
	validateSubscribeCustomerRequest,
	validateUpdatePlanRequest,
} from "./domain/validators/validation";
// Ports
export type {
	AuditLogAdapter,
	MemberSubscriptionRepository,
	NotificationServiceAdapter,
	PaymentGatewayAdapter,
	SubscriptionEventPublisher,
	SubscriptionPlanRepository,
} from "./ports/subscription-repository";
// Domain Types
export type {
	BenefitType,
	BillingInterval,
	CancelSubscriptionRequest,
	CreatePlanRequest,
	MemberSubscription,
	MembershipBenefit,
	Result,
	SubscribeCustomerRequest,
	SubscriptionFilters,
	SubscriptionPlan,
	SubscriptionStats,
	SubscriptionStatus,
	UpdatePlanRequest,
	ValidationResult,
} from "./types";
