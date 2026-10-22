// Fetch events action

import type { EventRepository } from "#analytics/modules/analytics/ports";
import type { Event } from "#analytics/modules/analytics/types";
import type {
	AnalyticsState,
	AnalyticsStateMutators,
} from "./useAnalyticsState";

export const createFetchEventsAction = (
	eventRepository: EventRepository,
	state: AnalyticsState & AnalyticsStateMutators,
) => {
	return async (page = 1) => {
		state.setLoading(true);
		state.setError(null);

		try {
			const filters = state.filters();
			let events: readonly Event[] = [];

			if (filters.userId) {
				const result = await eventRepository.findByUserId(filters.userId);
				if (result.success && result.data) {
					events = result.data;
				}
			} else if (filters.startDate && filters.endDate) {
				const options =
					filters.userId !== undefined ? { userId: filters.userId } : {};
				const result = await eventRepository.findByDateRange(
					filters.startDate,
					filters.endDate,
					options,
				);
				if (result.success && result.data) {
					events = result.data;
				}
			} else if (filters.sessionId) {
				const result = await eventRepository.findBySessionId(filters.sessionId);
				if (result.success && result.data) {
					events = result.data;
				}
			}

			// Apply pagination
			const offset = (page - 1) * 50;
			const paginatedEvents = events.slice(offset, offset + 50);

			state.setData({
				...state.data(),
				events: paginatedEvents,
			});
		} catch (error) {
			state.setError(
				error instanceof Error ? error.message : "Failed to fetch events",
			);
		} finally {
			state.setLoading(false);
		}
	};
};
