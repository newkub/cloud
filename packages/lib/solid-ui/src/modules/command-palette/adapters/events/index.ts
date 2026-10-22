/**
 * Events Adapter - Event dispatching implementation
 */

export {
	clear,
	createEventDispatcher,
	createMemoryEventDispatcher,
	dispatch,
	dispatchBatch,
	getActiveSubscriptions,
	getEventTypes,
	getSubscriptionCount,
	subscribe,
	unsubscribe,
} from "./memory-event-dispatcher";
