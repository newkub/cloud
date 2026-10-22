/**
 * Time Provider Adapter
 * Provides current timestamp functionality
 */

import type { TimeProvider } from "#analytics/modules/analytics/ports";

export const createTimeProvider = (): TimeProvider => ({
	now: (now: number = Date.now()): number => now,
});

export const timeProvider = createTimeProvider();
