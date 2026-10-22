/**
 * Memory Event Dispatcher - In-memory implementation
 * Functional style with immutable state
 */

import type { CommandEvent } from "../../domain/events/command-events";
import type { EventDispatcher } from "../../ports";
import type { Result } from "../../shared/types";

// State type
export type MemoryEventDispatcherState = Readonly<{
	subscriptions: Map<string, Map<string, (event: CommandEvent) => Promise<void>>>;
}>;

// Helper to generate subscription ID
const generateSubscriptionId = (): string => `sub_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

// Factory function
export const createMemoryEventDispatcher = (
	initialSubscriptions?: Map<string, Map<string, (event: CommandEvent) => Promise<void>>>,
): MemoryEventDispatcherState => ({
	subscriptions: initialSubscriptions || new Map(),
});

// Dispatch event
export const dispatch = async (state: MemoryEventDispatcherState, event: CommandEvent): Promise<Result<void>> => {
	try {
		const eventSubscriptions = state.subscriptions.get(event.type);
		if (!eventSubscriptions) {
			return { success: true, data: undefined };
		}

		const promises = Array.from(eventSubscriptions.values()).map((handler) => handler(event));
		await Promise.allSettled(promises);

		return { success: true, data: undefined };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

// Dispatch batch
export const dispatchBatch = async (
	state: MemoryEventDispatcherState,
	events: readonly CommandEvent[],
): Promise<Result<void>> => {
	for (const event of events) {
		const result = await dispatch(state, event);
		if (!result.success) {
			return result;
		}
	}
	return { success: true, data: undefined };
};

// Subscribe to event
export const subscribe = <T extends CommandEvent>(
	state: MemoryEventDispatcherState,
	eventType: T["type"],
	handler: (event: T) => Promise<void>,
): Promise<Result<string>> => {
	try {
		const subscriptionId = generateSubscriptionId();
		const newSubscriptions = new Map(state.subscriptions);

		if (!newSubscriptions.has(eventType)) {
			newSubscriptions.set(eventType, new Map());
		}
		const eventSubscriptions = newSubscriptions.get(eventType) as Map<string, (event: CommandEvent) => Promise<void>>;
		eventSubscriptions.set(subscriptionId, handler as (event: CommandEvent) => Promise<void>);

		return Promise.resolve({
			success: true,
			data: subscriptionId,
		});
	} catch (error) {
		return Promise.resolve({
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		});
	}
};

// Unsubscribe from event
export const unsubscribe = (state: MemoryEventDispatcherState, subscriptionId: string): Promise<Result<void>> => {
	try {
		const newSubscriptions = new Map(state.subscriptions);

		for (const [eventType, subscriptions] of newSubscriptions.entries()) {
			if (subscriptions.has(subscriptionId)) {
				const newEventSubs = new Map(subscriptions);
				newEventSubs.delete(subscriptionId);

				if (newEventSubs.size === 0) {
					newSubscriptions.delete(eventType);
				} else {
					newSubscriptions.set(eventType, newEventSubs);
				}

				return Promise.resolve({
					success: true,
					data: undefined,
				});
			}
		}

		return Promise.resolve({
			success: false,
			error: new Error(`Subscription with id ${subscriptionId} not found`),
		});
	} catch (error) {
		return Promise.resolve({
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		});
	}
};

// Get active subscriptions
export const getActiveSubscriptions = (state: MemoryEventDispatcherState): Promise<Result<readonly string[]>> => {
	try {
		const subscriptionIds: string[] = [];
		for (const subscriptions of state.subscriptions.values()) {
			subscriptionIds.push(...subscriptions.keys());
		}
		return Promise.resolve({ success: true, data: subscriptionIds });
	} catch (error) {
		return Promise.resolve({
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		});
	}
};

// Utility: Clear all subscriptions
export const clear = (): MemoryEventDispatcherState => createMemoryEventDispatcher(new Map());

// Utility: Get subscription count
export const getSubscriptionCount = (state: MemoryEventDispatcherState): number => {
	let count = 0;
	for (const subscriptions of state.subscriptions.values()) {
		count += subscriptions.size;
	}
	return count;
};

// Utility: Get event types
export const getEventTypes = (state: MemoryEventDispatcherState): readonly string[] =>
	Array.from(state.subscriptions.keys());

// Create EventDispatcher implementation (for backward compatibility)
export const createEventDispatcher = (state: MemoryEventDispatcherState): EventDispatcher => ({
	dispatch: (event) => dispatch(state, event),
	dispatchBatch: (events) => dispatchBatch(state, events),
	subscribe: <T extends CommandEvent>(eventType: T["type"], handler: (event: T) => Promise<void>) =>
		subscribe<T>(state, eventType, handler),
	unsubscribe: (id) => unsubscribe(state, id),
	getActiveSubscriptions: () => getActiveSubscriptions(state),
});
