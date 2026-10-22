// ============================================================================
// Connect Module - Domain Events
// ============================================================================

import type { ConnectedAccount } from "../../types";

// Base event type
export interface BaseDomainEvent {
	readonly eventType: string;
	readonly aggregateId: string;
	readonly occurredAt: Date;
	readonly version: number;
}

// Account Events
export interface AccountCreatedEvent extends BaseDomainEvent {
	readonly eventType: "AccountCreated";
	readonly aggregateId: string;
	readonly accountId: string;
	readonly accountType: string;
	readonly country: string;
	readonly email: string;
}

export interface AccountUpdatedEvent extends BaseDomainEvent {
	readonly eventType: "AccountUpdated";
	readonly aggregateId: string;
	readonly accountId: string;
	readonly changes: Record<string, unknown>;
}

export interface AccountVerifiedEvent extends BaseDomainEvent {
	readonly eventType: "AccountVerified";
	readonly aggregateId: string;
	readonly accountId: string;
	readonly verifiedAt: Date;
}

export interface AccountSuspendedEvent extends BaseDomainEvent {
	readonly eventType: "AccountSuspended";
	readonly aggregateId: string;
	readonly accountId: string;
	readonly reason: string;
}

export interface AccountCapabilitiesEnabledEvent extends BaseDomainEvent {
	readonly eventType: "AccountCapabilitiesEnabled";
	readonly aggregateId: string;
	readonly accountId: string;
	readonly capabilities: readonly string[];
}

export interface PayoutCreatedEvent extends BaseDomainEvent {
	readonly eventType: "PayoutCreated";
	readonly aggregateId: string;
	readonly accountId: string;
	readonly payoutId: string;
	readonly amount: number;
	readonly currency: string;
}

export interface PayoutCompletedEvent extends BaseDomainEvent {
	readonly eventType: "PayoutCompleted";
	readonly aggregateId: string;
	readonly accountId: string;
	readonly payoutId: string;
	readonly completedAt: Date;
}

export interface PayoutFailedEvent extends BaseDomainEvent {
	readonly eventType: "PayoutFailed";
	readonly aggregateId: string;
	readonly accountId: string;
	readonly payoutId: string;
	readonly reason: string;
}

// Union type for all connect events
export type ConnectDomainEvent =
	| AccountCreatedEvent
	| AccountUpdatedEvent
	| AccountVerifiedEvent
	| AccountSuspendedEvent
	| AccountCapabilitiesEnabledEvent
	| PayoutCreatedEvent
	| PayoutCompletedEvent
	| PayoutFailedEvent;

// Event constructors
export const createAccountCreatedEvent = (
	account: ConnectedAccount,
	now: number = Date.now(),
): AccountCreatedEvent => ({
	eventType: "AccountCreated",
	aggregateId: account.id,
	accountId: account.id,
	accountType: account.type,
	country: account.country,
	email: account.email,
	occurredAt: new Date(now),
	version: 1,
});

export const createAccountUpdatedEvent = (
	account: ConnectedAccount,
	changes: Record<string, unknown>,
	now: number = Date.now(),
): AccountUpdatedEvent => ({
	eventType: "AccountUpdated",
	aggregateId: account.id,
	accountId: account.id,
	changes,
	occurredAt: new Date(now),
	version: 1,
});

export const createAccountVerifiedEvent = (
	account: ConnectedAccount,
	now: number = Date.now(),
): AccountVerifiedEvent => ({
	eventType: "AccountVerified",
	aggregateId: account.id,
	accountId: account.id,
	verifiedAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});

export const createAccountSuspendedEvent = (
	account: ConnectedAccount,
	reason: string,
	now: number = Date.now(),
): AccountSuspendedEvent => ({
	eventType: "AccountSuspended",
	aggregateId: account.id,
	accountId: account.id,
	reason,
	occurredAt: new Date(now),
	version: 1,
});

export const createAccountCapabilitiesEnabledEvent = (
	account: ConnectedAccount,
	capabilities: readonly string[],
	now: number = Date.now(),
): AccountCapabilitiesEnabledEvent => ({
	eventType: "AccountCapabilitiesEnabled",
	aggregateId: account.id,
	accountId: account.id,
	capabilities,
	occurredAt: new Date(now),
	version: 1,
});
