// ============================================================================
// Connect Module - Domain Types
// ============================================================================

import type { Result } from "#shared/types/result-either";
import type {
	AccountBalance,
	AccountLink,
	BalanceItem,
	BusinessProfile,
	ConnectedAccount,
	Payout,
} from "../domain/models";

// Re-export domain models
export type {
	AccountBalance,
	AccountLink,
	BalanceItem,
	BusinessProfile,
	ConnectedAccount,
	Payout,
};

// Account Types
export type AccountType = "standard" | "express" | "custom";

export type AccountStatus =
	| "unverified"
	| "verified"
	| "suspended"
	| "restricted";

export type Capability =
	| "card_payments"
	| "transfers"
	| "legacy_payments"
	| "tax_registrations";

export type BusinessType =
	| "company"
	| "individual"
	| "government_entity"
	| "non_profit";

// Account Creation
export interface CreateAccountRequest {
	readonly type: AccountType;
	readonly businessType: BusinessType;
	readonly country: string;
	readonly email: string;
	readonly capabilities?: readonly Capability[];
	readonly businessProfile?: BusinessProfile;
}

// Account Update
export interface UpdateAccountRequest {
	readonly accountId: string;
	readonly businessProfile?: BusinessProfile;
	readonly capabilities?: readonly Capability[];
}

// Onboarding
export interface AccountLinkRequest {
	readonly accountId: string;
	readonly refreshUrl: string;
	readonly returnUrl: string;
	readonly type?: "account_onboarding" | "account_update";
}

// Payouts
export interface PayoutRequest {
	readonly accountId: string;
	readonly amount: number;
	readonly currency: string;
	readonly method?: "instant" | "standard";
}

// Validation
export type ValidationResult = Result<unknown, Error>;

// Filters
export interface AccountFilters {
	readonly status?: AccountStatus;
	readonly type?: AccountType;
	readonly country?: string;
}
