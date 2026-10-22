/**
 * Shared Constants
 * Static constants used across the application
 */

export const ANALYTICS_EVENTS = {
	PAGE_VIEW: "page_view",
	CLICK: "click",
	FORM_SUBMIT: "form_submit",
	ERROR: "error",
	CUSTOM: "custom",
} as const;

export const ANALYTICS_STATUS = {
	PENDING: "pending",
	SENT: "sent",
	FAILED: "failed",
	RETRY: "retry",
} as const;

export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const DEFAULT_BATCH_SIZE = 10;
export const DEFAULT_FLUSH_INTERVAL = 5000; // 5 seconds

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
} as const;

export type AnalyticsEvent =
	(typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
export type AnalyticsStatus =
	(typeof ANALYTICS_STATUS)[keyof typeof ANALYTICS_STATUS];
