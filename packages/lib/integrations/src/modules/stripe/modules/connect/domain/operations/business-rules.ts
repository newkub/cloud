// ============================================================================
// Connect Module - Business Rules
// ============================================================================

import { createBusinessRuleError } from "#shared/errors/domain-errors";
import type { DomainError } from "#shared/errors/error-types";
import type { Result } from "#shared/types/result-either";
import { failure, success } from "#shared/types/result-either";
import type { ConnectedAccount } from "../../domain/models";
import type { Capability, PayoutRequest } from "../../types";

// Account business rules
export const canCreateAccount = (
	existingAccounts: readonly ConnectedAccount[],
	email: string,
): Result<true, DomainError> => {
	const emailExists = existingAccounts.some((acc) => acc.email === email);
	if (emailExists) {
		return failure(
			createBusinessRuleError(
				"DUPLICATE_EMAIL",
				"An account with this email already exists",
				{ email },
			) as DomainError,
		);
	}
	return success(true) as Result<true, DomainError>;
};

export const canUpdateAccount = (
	account: ConnectedAccount,
): Result<true, DomainError> => {
	if (account.status === "suspended") {
		return failure(
			createBusinessRuleError(
				"ACCOUNT_SUSPENDED",
				"Cannot update a suspended account",
				{ accountId: account.id },
			) as DomainError,
		);
	}
	return success(true) as Result<true, DomainError>;
};

export const canDeleteAccount = (
	account: ConnectedAccount,
): Result<true, DomainError> => {
	if (account.chargesEnabled || account.payoutsEnabled) {
		return failure(
			createBusinessRuleError(
				"ACTIVE_ACCOUNT",
				"Cannot delete an active account with enabled charges or payouts",
				{ accountId: account.id },
			) as DomainError,
		);
	}
	return success(true) as Result<true, DomainError>;
};

// Payout business rules
export const canCreatePayout = (
	account: ConnectedAccount,
	request: PayoutRequest,
): Result<true, DomainError> => {
	if (!account.payoutsEnabled) {
		return failure(
			createBusinessRuleError(
				"PAYOUTS_NOT_ENABLED",
				"Payouts are not enabled for this account",
				{ accountId: account.id },
			) as DomainError,
		);
	}

	if (request.amount <= 0) {
		return failure(
			createBusinessRuleError(
				"INVALID_AMOUNT",
				"Payout amount must be greater than zero",
				{ amount: request.amount },
			) as DomainError,
		);
	}

	return success(true) as Result<true, DomainError>;
};

export const canEnableCapability = (
	account: ConnectedAccount,
	capability: Capability,
): Result<true, DomainError> => {
	if (account.capabilities.includes(capability)) {
		return failure(
			createBusinessRuleError(
				"CAPABILITY_ALREADY_ENABLED",
				"This capability is already enabled",
				{ accountId: account.id, capability },
			) as DomainError,
		);
	}
	return success(true) as Result<true, DomainError>;
};

// Balance business rules
export const hasSufficientBalance = (
	availableBalance: number,
	amount: number,
): Result<true, DomainError> => {
	if (availableBalance < amount) {
		return failure(
			createBusinessRuleError(
				"INSUFFICIENT_BALANCE",
				"Insufficient balance for this operation",
				{ availableBalance, amount },
			) as DomainError,
		);
	}
	return success(true) as Result<true, DomainError>;
};
