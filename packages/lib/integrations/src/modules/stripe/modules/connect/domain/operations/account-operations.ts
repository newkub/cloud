// ============================================================================
// Connect Module - Domain Operations (Pure Functions)
// ============================================================================

import type {
	AccountBalance,
	AccountType,
	BalanceItem,
	BusinessType,
	Capability,
	ConnectedAccount,
} from "../../types";

// Account Creation
export const createConnectedAccount = (
	params: {
		id: string;
		type: AccountType;
		businessType: BusinessType;
		country: string;
		email: string;
		capabilities: readonly Capability[];
	},
	now: number = Date.now(),
): ConnectedAccount => ({
	id: params.id,
	type: params.type,
	status: "unverified",
	businessType: params.businessType,
	country: params.country,
	email: params.email,
	capabilities: params.capabilities,
	payoutsEnabled: false,
	chargesEnabled: false,
	createdAt: new Date(now),
	updatedAt: new Date(now),
});

// Account Status Checks
export const isAccountVerified = (account: ConnectedAccount): boolean =>
	account.status === "verified";

export const isAccountSuspended = (account: ConnectedAccount): boolean =>
	account.status === "suspended";

export const isAccountRestricted = (account: ConnectedAccount): boolean =>
	account.status === "restricted";

export const isAccountActive = (account: ConnectedAccount): boolean =>
	["verified", "unverified"].includes(account.status);

// Capability Checks
export const hasCapability = (
	account: ConnectedAccount,
	capability: Capability,
): boolean => account.capabilities.includes(capability);

export const canAcceptPayments = (account: ConnectedAccount): boolean =>
	account.chargesEnabled && hasCapability(account, "card_payments");

export const canReceivePayouts = (account: ConnectedAccount): boolean =>
	account.payoutsEnabled && hasCapability(account, "transfers");

// Balance Calculations
export const calculateTotalAvailable = (balance: AccountBalance): number =>
	balance.available.reduce(
		(sum: number, item: BalanceItem) => sum + item.amount,
		0,
	);

export const calculateTotalPending = (balance: AccountBalance): number =>
	balance.pending.reduce(
		(sum: number, item: BalanceItem) => sum + item.amount,
		0,
	);

export const calculateTotalBalance = (balance: AccountBalance): number =>
	calculateTotalAvailable(balance) + calculateTotalPending(balance);

export const getBalanceByCurrency = (
	balance: AccountBalance,
	currency: string,
): BalanceItem[] => [
	...balance.available.filter((item) => item.currency === currency),
	...balance.pending.filter((item) => item.currency === currency),
];

// Account Type Checks
export const isStandardAccount = (account: ConnectedAccount): boolean =>
	account.type === "standard";

export const isExpressAccount = (account: ConnectedAccount): boolean =>
	account.type === "express";

export const isCustomAccount = (account: ConnectedAccount): boolean =>
	account.type === "custom";
