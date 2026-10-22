/**
 * Config Domain Operations
 * Pure functions for analytics configuration
 */

import type { AnalyticsConfig } from "#analytics/modules/analytics/types";

const defaultConfig: AnalyticsConfig = {
	enabled: true,
	endpoint:
		(globalThis as { process?: { env?: { ANALYTICS_ENDPOINT?: string } } })
			.process?.env?.ANALYTICS_ENDPOINT || "",
	apiKey:
		(globalThis as { process?: { env?: { ANALYTICS_API_KEY?: string } } })
			.process?.env?.ANALYTICS_API_KEY || "",
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

/**
 * Merge user config with defaults
 * @param config - Partial user configuration
 * @returns Merged configuration
 */
export const mergeConfig = (
	config: Partial<AnalyticsConfig> = {},
): AnalyticsConfig => {
	return { ...defaultConfig, ...config };
};

/**
 * Get default configuration
 * @returns Default analytics configuration
 */
export const getDefaultConfig = (): AnalyticsConfig => defaultConfig;
