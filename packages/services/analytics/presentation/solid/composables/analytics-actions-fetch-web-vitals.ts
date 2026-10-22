// Fetch web vitals action

import type { EventRepository } from "#analytics/modules/analytics/ports";
import type { Event, WebVital } from "#analytics/modules/analytics/types";
import type {
	AnalyticsState,
	AnalyticsStateMutators,
} from "./useAnalyticsState";

export const createFetchWebVitalsAction = (
	eventRepository: EventRepository,
	state: AnalyticsState & AnalyticsStateMutators,
) => {
	return async (page = 1) => {
		state.setLoading(true);
		state.setError(null);

		try {
			// Web vitals are stored as events with type "web_vital"
			const filters = state.filters();
			const options =
				filters.userId !== undefined ? { userId: filters.userId } : {};
			const result = await eventRepository.findByEventNames(
				["web_vital"],
				options,
			);

			let webVitals: readonly Event[] = [];
			if (result.success && result.data) {
				webVitals = result.data;
			}

			// Apply pagination
			const offset = (page - 1) * 50;
			const paginatedWebVitals = webVitals.slice(offset, offset + 50);

			state.setData({
				...state.data(),
				webVitals: paginatedWebVitals as unknown as readonly WebVital[],
			});
		} catch (error) {
			state.setError(
				error instanceof Error ? error.message : "Failed to fetch web vitals",
			);
		} finally {
			state.setLoading(false);
		}
	};
};
