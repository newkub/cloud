// ============================================================================
// Subscription Module - Domain Types
// ============================================================================

// Re-export Result from shared kernel for module API
export type { Result } from "#shared/types";

export type SubscriptionStatus =
	| "active"
	| "cancelled"
	| "past_due"
	| "paused"
	| "trialing";

export type BillingInterval = "monthly" | "quarterly" | "yearly" | "weekly";

export type BenefitType =
	| "discount"
	| "free_service"
	| "credits"
	| "priority"
	| "exclusive";

export interface SubscriptionPlan {
	readonly id: string;
	readonly organizationId: string;
	readonly name: string;
	readonly description?: string;
	readonly price: number;
	readonly currency: string;
	readonly interval: BillingInterval;
	readonly intervalCount: number;
	readonly trialDays: number;
	readonly features: readonly string[];
	readonly isActive: boolean;
	readonly isPublic: boolean;
	readonly maxMembers?: number;
	readonly setupFee?: number;
	readonly createdAt: string;
	readonly updatedAt: string;
	readonly billingInterval?: BillingInterval;
}

export interface MemberSubscription {
	readonly id: string;
	readonly customerId: string;
	readonly planId: string;
	readonly stripeSubscriptionId: string;
	readonly status: SubscriptionStatus;
	readonly currentPeriodStart: string;
	readonly currentPeriodEnd: string;
	readonly trialStart?: string;
	readonly trialEnd?: string;
	readonly cancelAtPeriodEnd: boolean;
	readonly cancelledAt?: string;
	readonly pausedAt?: string;
	readonly resumedAt?: string;
	readonly createdAt: string;
	readonly updatedAt: string;
	readonly metadata?: Record<string, unknown>;
	readonly currency?: string;
	// Additional fields for workflow operations
	readonly plan?: SubscriptionPlan;
	readonly nextBillingDate?: string;
	readonly paymentMethod?: string;
	readonly amount?: number;
	readonly startDate?: string;
	readonly endDate?: string;
	readonly cancellationDate?: string;
}

export interface MembershipBenefit {
	readonly id: string;
	readonly name: string;
	readonly description: string;
	readonly type: BenefitType;
	readonly value: number;
	readonly applicableServices?: readonly string[];
}

export interface SubscriptionFilters {
	readonly status?: SubscriptionStatus;
	readonly planId?: string;
	readonly customerId?: string;
	readonly stripeSubscriptionId?: string;
	readonly dateFrom?: string;
	readonly dateTo?: string;
}

export interface SubscribeCustomerRequest {
	readonly customerId: string;
	readonly planId: string;
	readonly paymentMethod?: string;
	readonly stripeSubscriptionId?: string;
	readonly status?: SubscriptionStatus;
	readonly currentPeriodStart?: Date;
	readonly currentPeriodEnd?: Date;
	readonly trialStart?: Date;
	readonly trialEnd?: Date;
	readonly metadata?: Record<string, unknown>;
}

export interface CancelSubscriptionRequest {
	readonly subscriptionId: string;
	readonly reason?: string;
}

export type SubscriptionStats = {
	readonly totalActive: number;
	readonly monthlyRecurring: number;
	readonly churnRate: number;
	readonly trialing: number;
};

// Request/Response types for application layer
export interface CreatePlanRequest {
	readonly organizationId: string;
	readonly name: string;
	readonly description?: string;
	readonly price: number;
	readonly currency: string;
	readonly interval: BillingInterval;
	readonly intervalCount: number;
	readonly trialDays: number;
	readonly features: readonly string[];
	readonly isActive?: boolean;
	readonly isPublic: boolean;
	readonly maxMembers?: number;
	readonly setupFee?: number;
	readonly billingInterval?: "monthly" | "yearly";
	readonly benefits?: readonly string[];
}

export interface UpdatePlanRequest {
	readonly name?: string;
	readonly description?: string;
	readonly price?: number;
	readonly currency?: string;
	readonly features?: readonly string[];
	readonly isActive?: boolean;
	readonly isPublic?: boolean;
	readonly maxMembers?: number;
	readonly setupFee?: number;
	readonly billingInterval?: BillingInterval;
	readonly trialDays?: number;
	readonly benefits?: readonly string[];
}

// Validation Result Type
export interface ValidationResult<T = unknown> {
	readonly isValid: boolean;
	readonly errors?: readonly string[];
	readonly data?: T;
}

// Module Configuration Options
export interface SubscriptionModuleOptions {
	enabled?: boolean;
	defaultTrialDays?: number;
	gracePeriodDays?: number;
	autoRenewalEnabled?: boolean;
}
