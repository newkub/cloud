/**
 * Web Vital Domain Model
 * Analytics web vital domain type
 */

import type { Timestamp } from "#analytics/modules/analytics/types";

export type WebVital = Readonly<{
	name: string;
	value: number;
	rating: "good" | "needs-improvement" | "poor";
	timestamp: Timestamp;
	path?: string;
}>;
