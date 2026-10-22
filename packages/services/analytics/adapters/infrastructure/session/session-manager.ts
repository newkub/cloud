/**
 * Session Manager (Functional style)
 * Pure functions for session management
 */

import type { AnalyticsConfig } from "#analytics/modules/analytics/types";

export interface SessionState {
	readonly sessionId: string;
	readonly userId: string;
	readonly lastActivity: number;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const initSession = (
	config: AnalyticsConfig,
	now2: number = Date.now(),
	randomUUID: () => string = (
		randomUUID: () => string = () => crypto.randomUUID(),
	) => randomUUID(),
): SessionState => {
	const timeout = config.sessionTimeout || SESSION_TIMEOUT;
	const now = now2;

	// Get or create session ID from localStorage
	const storedSessionId = localStorage.getItem("analytics_session_id");
	const storedSessionTime = localStorage.getItem("analytics_session_time");

	let sessionId: string;
	if (storedSessionId && storedSessionTime) {
		const sessionTime = Number.parseInt(storedSessionTime, 10);
		if (now - sessionTime < timeout) {
			sessionId = storedSessionId;
		} else {
			// Session expired, create new one
			sessionId = randomUUID();
		}
	} else {
		sessionId = randomUUID();
	}

	localStorage.setItem("analytics_session_id", sessionId);
	localStorage.setItem("analytics_session_time", now.toString());

	// Get user ID
	const userId = localStorage.getItem("analytics_user_id") || "";

	return {
		sessionId,
		userId,
		lastActivity: now,
	};
};

export const resetSession = (
	randomUUID: () => string = (
		randomUUID: () => string = () => crypto.randomUUID(),
	) => randomUUID(),
	now2: number = Date.now(),
): SessionState => {
	const sessionId = randomUUID();
	const userId = "";
	const now = now2;

	localStorage.setItem("analytics_session_id", sessionId);
	localStorage.setItem("analytics_session_time", now.toString());
	localStorage.removeItem("analytics_user_id");

	return {
		sessionId,
		userId,
		lastActivity: now,
	};
};

export const setUserId = (userId: string): void => {
	localStorage.setItem("analytics_user_id", userId);
};

export const getUserId = (): string => {
	return localStorage.getItem("analytics_user_id") || "";
};

export const isSessionExpired = (
	sessionState: SessionState,
	config: AnalyticsConfig,
	now: number = Date.now(),
): boolean => {
	const timeout = config.sessionTimeout || SESSION_TIMEOUT;
	return now - sessionState.lastActivity > timeout;
};
