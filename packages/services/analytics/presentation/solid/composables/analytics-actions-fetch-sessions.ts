// Fetch sessions action

import type { SessionRepository } from "#analytics/modules/analytics/ports";
import type { Session } from "#analytics/modules/analytics/types";
import type {
	AnalyticsState,
	AnalyticsStateMutators,
} from "./useAnalyticsState";

export const createFetchSessionsAction = (
	sessionRepository: SessionRepository,
	state: AnalyticsState & AnalyticsStateMutators,
) => {
	return async (page = 1) => {
		state.setLoading(true);
		state.setError(null);

		try {
			const filters = state.filters();
			let sessions: readonly Session[] = [];

			if (filters.userId) {
				const result = await sessionRepository.findByUserId(filters.userId);
				if (result.success && result.data) {
					sessions = result.data;
				}
			} else {
				// Fetch active sessions (last 24 hours)
				const result = await sessionRepository.findActiveSessions(
					24 * 60 * 60 * 1000,
				);
				if (result.success && result.data) {
					sessions = result.data;
				}
			}

			// Apply pagination
			const offset = (page - 1) * 50;
			const paginatedSessions = sessions.slice(offset, offset + 50);

			state.setData({
				...state.data(),
				sessions: paginatedSessions,
			});
		} catch (error) {
			state.setError(
				error instanceof Error ? error.message : "Failed to fetch sessions",
			);
		} finally {
			state.setLoading(false);
		}
	};
};
