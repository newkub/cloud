// ============================================================================
// Connect Module - Ports (Interfaces)
// ============================================================================

import type { AsyncResult } from "#shared/types/result-either";
import type {
	AccountBalance,
	AccountLink,
	ConnectedAccount,
	Payout,
} from "../types";

// Repository Port
export interface ConnectAccountRepository {
	// Account CRUD
	createAccount(request: {
		type: string;
		businessType: string;
		country: string;
		email: string;
	}): AsyncResult<ConnectedAccount, Error>;
	getAccount(accountId: string): AsyncResult<ConnectedAccount, Error>;
	getAccounts(filters?: {
		status?: string;
		type?: string;
		country?: string;
	}): AsyncResult<readonly ConnectedAccount[], Error>;
	updateAccount(
		accountId: string,
		updates: Record<string, unknown>,
	): AsyncResult<ConnectedAccount, Error>;
	deleteAccount(accountId: string): AsyncResult<void, Error>;

	// Account Link
	createAccountLink(
		accountId: string,
		refreshUrl: string,
		returnUrl: string,
		type?: string,
	): AsyncResult<AccountLink, Error>;

	// Balance
	getAccountBalance(accountId: string): AsyncResult<AccountBalance, Error>;

	// Payouts
	createPayout(
		accountId: string,
		amount: number,
		currency: string,
		method?: string,
	): AsyncResult<Payout, Error>;
	getPayouts(accountId: string): AsyncResult<readonly Payout[], Error>;
}

// Event Publisher Port
export interface ConnectEventPublisher {
	publish(event: {
		eventType: string;
		[key: string]: unknown;
	}): AsyncResult<void, Error>;
}

// Stripe Adapter Port
export interface StripeConnectAdapter {
	createAccount(params: {
		type: string;
		business_type: string;
		country: string;
		email: string;
		capabilities?: readonly string[];
	}): AsyncResult<ConnectedAccount, Error>;
	updateAccount(
		accountId: string,
		updates: Record<string, unknown>,
	): AsyncResult<ConnectedAccount, Error>;
	createAccountLink(params: {
		account: string;
		refresh_url: string;
		return_url: string;
		type?: string;
	}): AsyncResult<AccountLink, Error>;
	retrieveAccount(accountId: string): AsyncResult<ConnectedAccount, Error>;
	retrieveBalance(accountId: string): AsyncResult<AccountBalance, Error>;
	createPayout(params: {
		account: string;
		amount: number;
		currency: string;
		method?: string;
	}): AsyncResult<Payout, Error>;
}
