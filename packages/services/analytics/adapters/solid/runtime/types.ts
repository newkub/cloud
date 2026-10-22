// Re-export domain types to avoid duplication

export type { Event } from "#analytics/modules/analytics/domain/models/event";
export type { User } from "#analytics/modules/analytics/domain/models/user";
export type {
	EventProperties,
	EventType,
	SessionId,
	UserId,
	UTMParameters,
} from "#analytics/modules/analytics/types";

export interface AnalyticsConfig {
	/**
	 * API key for authentication
	 * @default process.env.ANALYTICS_API_KEY
	 */
	apiKey: string;

	/**
	 * Enable automatic page view tracking
	 * @default true
	 */
	autoTrack: boolean;

	/**
	 * Batch events before sending
	 * @default true
	 */
	batchEvents: boolean;

	/**
	 * Batch size
	 * @default 10
	 */
	batchSize: number;

	/**
	 * Consent for tracking (GDPR)
	 * @default true
	 */
	consent: boolean;

	/**
	 * Enable debug mode
	 * @default false
	 */
	debug: boolean;

	/**
	 * Custom properties to include with all events
	 */
	defaultProperties?: Record<string, unknown>;
	/**
	 * Enable analytics
	 * @default true
	 */
	enabled?: boolean;

	/**
	 * Analytics endpoint URL
	 * @default process.env.ANALYTICS_ENDPOINT
	 */
	endpoint: string;

	/**
	 * Enable error tracking
	 * @default true
	 */
	errorTracking: boolean;

	/**
	 * Flush interval in milliseconds
	 * @default 5000
	 */
	flushInterval: number;

	/**
	 * Enable session replay
	 * @default false
	 */
	sessionReplay: boolean;

	/**
	 * Session timeout in milliseconds
	 * @default 30 * 60 * 1000 (30 minutes)
	 */
	sessionTimeout: number;

	/**
	 * Enable web vitals tracking
	 * @default true
	 */
	webVitals: boolean;
}

export interface PageViewEvent extends Event {
	name: "page_view";
	properties: {
		/**
		 * Page path
		 */
		path: string;

		/**
		 * Page title
		 */
		title?: string;

		/**
		 * Referrer
		 */
		referrer?: string;

		/**
		 * UTM parameters
		 */
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_term?: string;
		utm_content?: string;
	};
}

export interface SessionReplayConfig {
	/**
	 * Block sensitive elements
	 */
	blockSelectors?: string[];
	/**
	 * Enable session replay
	 */
	enabled: boolean;

	/**
	 * Mask sensitive inputs
	 */
	maskInputs?: boolean;

	/**
	 * Max session length in milliseconds
	 * @default 30 * 60 * 1000 (30 minutes)
	 */
	maxSessionLength?: number;

	/**
	 * Sample rate (0-1)
	 * @default 0.1 (10%)
	 */
	sampleRate?: number;
}
