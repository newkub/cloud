// ============================================================================
// Connect Module - Domain Models (Readonly Data Models)
// ============================================================================

// Connected Account Model
export interface ConnectedAccount {
	readonly id: string;
	readonly type: "standard" | "express" | "custom";
	readonly status: "unverified" | "verified" | "suspended" | "restricted";
	readonly businessType:
		| "company"
		| "individual"
		| "government_entity"
		| "non_profit";
	readonly country: string;
	readonly email: string;
	readonly capabilities: readonly (
		| "card_payments"
		| "transfers"
		| "legacy_payments"
		| "tax_registrations"
	)[];
	readonly payoutsEnabled: boolean;
	readonly chargesEnabled: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

// Business Profile Model
export interface BusinessProfile {
	readonly name: string;
	readonly url?: string;
	readonly supportEmail?: string;
	readonly supportPhone?: string;
	[key: string]: unknown;
}

// Account Link Model
export interface AccountLink {
	readonly url: string;
	readonly expiresAt: Date;
}

// Payout Model
export interface Payout {
	readonly id: string;
	readonly accountId: string;
	readonly amount: number;
	readonly currency: string;
	readonly status: "pending" | "in_transit" | "paid" | "failed";
	readonly arrivalDate?: Date;
	readonly createdAt: Date;
}

// Account Balance Model
export interface AccountBalance {
	readonly accountId: string;
	readonly available: readonly BalanceItem[];
	readonly pending: readonly BalanceItem[];
}

// Balance Item Model
export interface BalanceItem {
	readonly amount: number;
	readonly currency: string;
	readonly sourceTypes?: readonly string[];
}
