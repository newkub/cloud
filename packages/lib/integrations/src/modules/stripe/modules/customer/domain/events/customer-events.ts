// ============================================================================
// Customer Module - Domain Events
// ============================================================================

import type { Customer } from "../../types";

// Base event type
export interface BaseDomainEvent {
	readonly eventType: string;
	readonly aggregateId: string;
	readonly occurredAt: Date;
	readonly version: number;
}

// Customer Events
export interface CustomerCreatedEvent extends BaseDomainEvent {
	readonly eventType: "CustomerCreated";
	readonly aggregateId: string;
	readonly customerId: string;
	readonly email: string;
	readonly name?: string;
}

export interface CustomerUpdatedEvent extends BaseDomainEvent {
	readonly eventType: "CustomerUpdated";
	readonly aggregateId: string;
	readonly customerId: string;
	readonly changes: Record<string, unknown>;
}

export interface CustomerDeletedEvent extends BaseDomainEvent {
	readonly eventType: "CustomerDeleted";
	readonly aggregateId: string;
	readonly customerId: string;
	readonly deletedAt: Date;
}

export interface CustomerPaymentMethodAddedEvent extends BaseDomainEvent {
	readonly eventType: "CustomerPaymentMethodAdded";
	readonly aggregateId: string;
	readonly customerId: string;
	readonly paymentMethodId: string;
}

export interface CustomerPaymentMethodRemovedEvent extends BaseDomainEvent {
	readonly eventType: "CustomerPaymentMethodRemoved";
	readonly aggregateId: string;
	readonly customerId: string;
	readonly paymentMethodId: string;
}

// Union type for all customer events
export type CustomerDomainEvent =
	| CustomerCreatedEvent
	| CustomerUpdatedEvent
	| CustomerDeletedEvent
	| CustomerPaymentMethodAddedEvent
	| CustomerPaymentMethodRemovedEvent;

// Event constructors
export const createCustomerCreatedEvent = (
	customer: Customer,
	now: number = Date.now(),
): CustomerCreatedEvent => ({
	eventType: "CustomerCreated",
	aggregateId: customer.id,
	customerId: customer.id,
	email: customer.email,
	name: customer.name,
	occurredAt: new Date(now),
	version: 1,
});

export const createCustomerUpdatedEvent = (
	customer: Customer,
	changes: Record<string, unknown>,
	now: number = Date.now(),
): CustomerUpdatedEvent => ({
	eventType: "CustomerUpdated",
	aggregateId: customer.id,
	customerId: customer.id,
	changes,
	occurredAt: new Date(now),
	version: 1,
});

export const createCustomerDeletedEvent = (
	customer: Customer,
	now: number = Date.now(),
): CustomerDeletedEvent => ({
	eventType: "CustomerDeleted",
	aggregateId: customer.id,
	customerId: customer.id,
	deletedAt: new Date(now),
	occurredAt: new Date(now),
	version: 1,
});

export const createCustomerPaymentMethodAddedEvent = (
	customerId: string,
	paymentMethodId: string,
	now: number = Date.now(),
): CustomerPaymentMethodAddedEvent => ({
	eventType: "CustomerPaymentMethodAdded",
	aggregateId: customerId,
	customerId,
	paymentMethodId,
	occurredAt: new Date(now),
	version: 1,
});

export const createCustomerPaymentMethodRemovedEvent = (
	customerId: string,
	paymentMethodId: string,
	now: number = Date.now(),
): CustomerPaymentMethodRemovedEvent => ({
	eventType: "CustomerPaymentMethodRemoved",
	aggregateId: customerId,
	customerId,
	paymentMethodId,
	occurredAt: new Date(now),
	version: 1,
});
