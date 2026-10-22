/**
 * Default configuration constants for analytics
 */

import type { AnalyticsConfig } from "#analytics/modules/analytics/types";

export const CONFIG_DEFAULTS = {
	SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
	BATCH_SIZE: 10,
	BATCH_INTERVAL: 5000, // 5 seconds
	MAX_QUEUE_SIZE: 100,
} as const;

export const defaultConfig: AnalyticsConfig = {
	enabled: true,
	endpoint: "",
	apiKey: "",
	autoTrack: true,
	sessionReplay: false,
	sessionTimeout: 30 * 60 * 1000,
	debug: false,
	webVitals: true,
	errorTracking: true,
	consent: true,
	batchEvents: true,
	batchSize: 10,
	flushInterval: 5000,
};
