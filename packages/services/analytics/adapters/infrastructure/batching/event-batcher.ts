/**
 * Event Batcher (Functional style)
 * Pure functions for event batching
 */

import type { AnalyticsConfig } from "#analytics/modules/analytics/types";
import type { AnalyticsEvent } from "../http/fetch-client";

export type EventBatcherState = Readonly<{
	readonly eventQueue: AnalyticsEvent[];
	readonly flushTimer: ReturnType<typeof setTimeout> | null;
}>;

export type EventBatcherDependencies = Readonly<{
	readonly config: AnalyticsConfig;
	readonly onFlush: (events: AnalyticsEvent[]) => void;
}>;

export const createEventBatcher = (
	_dependencies: EventBatcherDependencies,
): EventBatcherState => ({
	eventQueue: [],
	flushTimer: null,
});

export const addEvent = (
	state: EventBatcherState,
	dependencies: EventBatcherDependencies,
	event: AnalyticsEvent,
): EventBatcherState => {
	const { config, onFlush } = dependencies;

	if (config.batchEvents) {
		const newQueue = [...state.eventQueue, event];
		const batchSize = config.batchSize || 10;

		if (newQueue.length >= batchSize) {
			const flushedState = flush(
				{ ...state, eventQueue: newQueue },
				dependencies,
			);
			return flushedState;
		} else {
			return scheduleFlush({ ...state, eventQueue: newQueue }, dependencies);
		}
	} else {
		onFlush([event]);
		return state;
	}
};

export const flush = (
	state: EventBatcherState,
	dependencies: EventBatcherDependencies,
): EventBatcherState => {
	if (state.eventQueue.length === 0) {
		return state;
	}

	const events = [...state.eventQueue];
	dependencies.onFlush(events);

	if (state.flushTimer) {
		clearTimeout(state.flushTimer);
	}

	return {
		eventQueue: [],
		flushTimer: null,
	};
};

const scheduleFlush = (
	state: EventBatcherState,
	dependencies: EventBatcherDependencies,
): EventBatcherState => {
	if (state.flushTimer) {
		return state;
	}

	const interval = dependencies.config.flushInterval || 5000;
	const flushTimer = setTimeout(() => {
		flush(state, dependencies);
	}, interval);

	return {
		...state,
		flushTimer,
	};
};

export const cleanup = (state: EventBatcherState): EventBatcherState => {
	if (state.flushTimer) {
		clearTimeout(state.flushTimer);
	}

	return {
		...state,
		flushTimer: null,
	};
};
