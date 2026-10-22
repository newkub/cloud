/**
 * Handler Domain Operations
 * Pure functions for creating analytics event handlers
 */

import type { AnalyticsConfig } from "#analytics/modules/analytics/types";

/**
 * Create track handler
 * @param addToBatch - Function to add events to batch
 * @param options - Analytics configuration
 * @returns Track function
 */
export const createTrackHandler = (
	addToBatch: (type: string, data: Record<string, unknown>) => void,
	options: AnalyticsConfig,
) => {
	return (event: string, data?: Record<string, unknown>): void => {
		if (!options.enabled) return;
		addToBatch("track", { event, ...data });
	};
};

/**
 * Create identify handler
 * @param addToBatch - Function to add events to batch
 * @param options - Analytics configuration
 * @returns Identify function
 */
export const createIdentifyHandler = (
	addToBatch: (type: string, data: Record<string, unknown>) => void,
	options: AnalyticsConfig,
) => {
	return (userId: string, traits?: Record<string, unknown>): void => {
		if (!options.enabled) return;
		addToBatch("identify", { userId, traits });
	};
};

/**
 * Create page handler
 * @param addToBatch - Function to add events to batch
 * @param options - Analytics configuration
 * @returns Page function
 */
export const createPageHandler = (
	addToBatch: (type: string, data: Record<string, unknown>) => void,
	options: AnalyticsConfig,
) => {
	return (name?: string, properties?: Record<string, unknown>): void => {
		if (!options.enabled) return;
		addToBatch("page", { name, properties });
	};
};
