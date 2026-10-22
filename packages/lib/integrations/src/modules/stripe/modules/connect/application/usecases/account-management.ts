// ============================================================================
// Connect Module - Application Layer - Account Management
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import {
	createAccountCreatedEvent,
	createAccountUpdatedEvent,
} from "../../domain/events/connect-events";
import {
	canCreateAccount,
	canUpdateAccount,
} from "../../domain/operations/business-rules";
import {
	validateCreateAccountRequest,
	validateUpdateAccountRequest,
} from "../../domain/validators/validation";
import type {
	ConnectAccountRepository,
	StripeConnectAdapter,
} from "../../ports/connect-repository";
import type {
	AccountBalance,
	AccountLink,
	ConnectedAccount,
	CreateAccountRequest,
	UpdateAccountRequest,
} from "../../types";

// Dependencies
export interface AccountManagementDependencies {
	readonly repository: ConnectAccountRepository;
	readonly stripeAdapter: StripeConnectAdapter;
	readonly eventPublisher?: {
		publish(event: unknown): AsyncResult<void, Error>;
	};
}

// Create Account
export const createAccount = async (
	request: CreateAccountRequest,
	dependencies: AccountManagementDependencies,
): AsyncResult<ConnectedAccount, Error> => {
	// Validate request
	const validationResult = validateCreateAccountRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Check business rules
	const existingAccountsResult = await dependencies.repository.getAccounts();
	if (!existingAccountsResult.success) {
		return existingAccountsResult;
	}

	const canCreateResult = canCreateAccount(
		existingAccountsResult.data,
		request.email,
	);
	if (!canCreateResult.success) {
		return {
			success: false,
			error: new Error(canCreateResult.error.message),
		};
	}

	// Create account via Stripe
	const stripeResult = await dependencies.stripeAdapter.createAccount({
		type: request.type,
		business_type: request.businessType,
		country: request.country,
		email: request.email,
		capabilities: request.capabilities,
	});
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Save to repository
	const saveResult = await dependencies.repository.createAccount(request);
	if (!saveResult.success) {
		return saveResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createAccountCreatedEvent(saveResult.data),
		);
	}

	return saveResult;
};

// Get Account
export const getAccount = async (
	accountId: string,
	dependencies: AccountManagementDependencies,
): AsyncResult<ConnectedAccount, Error> => {
	return dependencies.repository.getAccount(accountId);
};

// Get Accounts
export const getAccounts = async (
	dependencies: AccountManagementDependencies,
	filters?: { status?: string; type?: string; country?: string },
): AsyncResult<readonly ConnectedAccount[], Error> => {
	return dependencies.repository.getAccounts(filters);
};

// Update Account
export const updateAccount = async (
	request: UpdateAccountRequest,
	dependencies: AccountManagementDependencies,
): AsyncResult<ConnectedAccount, Error> => {
	// Validate request
	const validationResult = validateUpdateAccountRequest(request);
	if (!validationResult.success) {
		return {
			success: false,
			error: new Error(validationResult.error.message),
		};
	}

	// Get existing account
	const existingResult = await dependencies.repository.getAccount(
		request.accountId,
	);
	if (!existingResult.success) {
		return existingResult;
	}

	// Check business rules
	const canUpdateResult = canUpdateAccount(existingResult.data);
	if (!canUpdateResult.success) {
		return {
			success: false,
			error: new Error(canUpdateResult.error.message),
		};
	}

	// Update via Stripe
	const stripeResult = await dependencies.stripeAdapter.updateAccount(
		request.accountId,
		request.businessProfile || {},
	);
	if (!stripeResult.success) {
		return stripeResult;
	}

	// Update in repository
	const updateResult = await dependencies.repository.updateAccount(
		request.accountId,
		request.businessProfile || {},
	);
	if (!updateResult.success) {
		return updateResult;
	}

	// Publish event
	if (dependencies.eventPublisher) {
		await dependencies.eventPublisher.publish(
			createAccountUpdatedEvent(
				updateResult.data,
				request.businessProfile || {},
			),
		);
	}

	return updateResult;
};

// Create Account Link
export const createAccountLink = async (
	accountId: string,
	refreshUrl: string,
	returnUrl: string,
	dependencies: AccountManagementDependencies,
	type?: string,
): AsyncResult<AccountLink, Error> => {
	return dependencies.repository.createAccountLink(
		accountId,
		refreshUrl,
		returnUrl,
		type,
	);
};

// Get Account Balance
export const getAccountBalance = async (
	accountId: string,
	dependencies: AccountManagementDependencies,
): AsyncResult<AccountBalance, Error> => {
	const balanceResult =
		await dependencies.repository.getAccountBalance(accountId);
	if (!balanceResult.success) {
		return balanceResult;
	}

	return balanceResult;
};
