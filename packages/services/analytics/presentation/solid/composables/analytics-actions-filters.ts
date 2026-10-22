// Filter actions

import type {
	AnalyticsFilter,
	AnalyticsState,
	AnalyticsStateMutators,
} from "./useAnalyticsState";

export const createSetFiltersAction = (
	state: AnalyticsState & AnalyticsStateMutators,
	fetchEvents: () => Promise<void>,
) => {
	return (filters: AnalyticsFilter) => {
		state.setFilters(filters);
		void fetchEvents();
	};
};

export const createClearFiltersAction = (
	state: AnalyticsState & AnalyticsStateMutators,
	fetchEvents: () => Promise<void>,
) => {
	return () => {
		state.clearFilters();
		void fetchEvents();
	};
};
