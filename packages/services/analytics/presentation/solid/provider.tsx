/**
 * Analytics Provider - SolidJS Context Provider
 * Clean Architecture implementation using pure functions
 */

import type { JSX } from "solid-js";
import { createContext, useContext } from "solid-js";
import { sendEventsToEndpoint } from "#analytics/adapters/infrastructure/analytics-http";
import { mergeConfig } from "#analytics/modules/analytics/domain/operations/config-operations";
import {
	createIdentifyHandler,
	createPageHandler,
	createTrackHandler,
} from "#analytics/modules/analytics/domain/operations/handler-operations";
import type { AnalyticsConfig } from "#analytics/modules/analytics/types";

export interface AnalyticsContextValue extends AnalyticsConfig {
	readonly track: (event: string, data?: Record<string, unknown>) => void;
	readonly identify: (userId: string, traits?: Record<string, unknown>) => void;
	readonly page: (name?: string, properties?: Record<string, unknown>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(
	undefined,
);

// Factory function: create event batch manager
const createEventBatchManager = (
	options: AnalyticsConfig,
	flushEvents: () => Promise<void>,
) => {
	const eventBatch: Array<{ type: string; data: Record<string, unknown> }> = [];
	let flushTimeout: ReturnType<typeof setTimeout> | null = null;

	const addToBatch = (type: string, data: Record<string, unknown>): void => {
		if (!options.enabled) return;

		eventBatch.push({ type, data });

		if (options.batchEvents) {
			if (eventBatch.length >= (options.batchSize || 10)) {
				flushEvents();
			} else if (!flushTimeout) {
				flushTimeout = setTimeout(() => {
					flushEvents();
					flushTimeout = null;
				}, options.flushInterval || 5000);
			}
		} else {
			flushEvents();
		}
	};

	const getBatch = () => [...eventBatch];
	const clearBatch = () => {
		eventBatch.length = 0;
	};

	return { addToBatch, getBatch, clearBatch };
};

export function createAnalyticsContext(
	config: Partial<AnalyticsConfig> = {},
): AnalyticsContextValue {
	const options = mergeConfig(config);

	let batchManager: ReturnType<typeof createEventBatchManager>;

	const flushEvents = async (): Promise<void> => {
		if (!options.endpoint || !options.apiKey) {
			return;
		}

		const eventsToSend = batchManager.getBatch();
		if (eventsToSend.length === 0) {
			return;
		}

		batchManager.clearBatch();
		await sendEventsToEndpoint(
			options.endpoint,
			options.apiKey,
			eventsToSend,
			options.debug ?? false,
		);
	};

	batchManager = createEventBatchManager(options, flushEvents);

	const track = createTrackHandler(batchManager.addToBatch, options);
	const identify = createIdentifyHandler(batchManager.addToBatch, options);
	const page = createPageHandler(batchManager.addToBatch, options);

	return {
		...options,
		track,
		identify,
		page,
	};
}

export function AnalyticsProvider(props: {
	children: JSX.Element;
	config?: Partial<AnalyticsConfig>;
}) {
	const contextValue = createAnalyticsContext(props.config);

	return (
		<AnalyticsContext.Provider value={contextValue}>
			{props.children}
		</AnalyticsContext.Provider>
	);
}

export function useAnalytics(): AnalyticsContextValue {
	const context = useContext(AnalyticsContext);
	if (!context) {
		throw new Error("useAnalytics must be used within an AnalyticsProvider");
	}
	return context;
}

export default AnalyticsProvider;
