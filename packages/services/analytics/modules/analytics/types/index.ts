/**
 * Module-specific types
 * Analytics domain types specific to this module
 */

// Module-specific configuration
export interface AnalyticsConfig {
	readonly enabled?: boolean;
	readonly endpoint?: string;
	readonly apiKey?: string;
	readonly autoTrack?: boolean;
	readonly sessionReplay?: boolean;
	readonly sessionTimeout?: number;
	readonly debug?: boolean;
	readonly webVitals?: boolean;
	readonly errorTracking?: boolean;
	readonly consent?: boolean;
	readonly batchEvents?: boolean;
	readonly batchSize?: number;
	readonly flushInterval?: number;
}

// Re-export shared types for convenience
export type * from "#analytics/shared/types";
// Re-export domain models
export type { Event } from "../domain/models/event";
export type { Funnel, FunnelStep } from "../domain/models/funnel";
export type { RetentionData } from "../domain/models/retention";
export type { Session } from "../domain/models/session";
export type { User } from "../domain/models/user";
export type { WebVital } from "../domain/models/web-vital";
