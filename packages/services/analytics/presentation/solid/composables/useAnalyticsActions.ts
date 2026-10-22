// ============================================================================
// Analytics Actions Composable - SolidJS
// Functional Programming - Composable for analytics actions
// ============================================================================

import { onMount } from "solid-js";
import type {
	EventRepository,
	SessionRepository,
	UserRepository,
} from "#analytics/modules/analytics/ports";
import { createFetchEventsAction } from "./analytics-actions-fetch-events";
import { createFetchSessionsAction } from "./analytics-actions-fetch-sessions";
import { createFetchUsersAction } from "./analytics-actions-fetch-users";
import { createFetchWebVitalsAction } from "./analytics-actions-fetch-web-vitals";
import {
	createClearFiltersAction,
	createSetFiltersAction,
} from "./analytics-actions-filters";
import { createIdentifyUserAction } from "./analytics-actions-identify-user";
import type { AnalyticsActions } from "./analytics-actions-interface";
import { createRefreshAction } from "./analytics-actions-refresh";
import { createTrackEventAction } from "./analytics-actions-track-event";
import { useAnalyticsState } from "./useAnalyticsState";

export function useAnalyticsActions(
	eventRepository: EventRepository,
	sessionRepository: SessionRepository,
	userRepository: UserRepository,
): AnalyticsActions {
	const state = useAnalyticsState();

	const fetchEvents = createFetchEventsAction(eventRepository, state);
	const fetchSessions = createFetchSessionsAction(sessionRepository, state);
	const fetchUsers = createFetchUsersAction(userRepository, state);
	const fetchWebVitals = createFetchWebVitalsAction(eventRepository, state);
	const trackEvent = createTrackEventAction(state, {
		eventRepository,
		sessionRepository,
	});
	const identifyUser = createIdentifyUserAction(userRepository, state);
	const setFilters = createSetFiltersAction(state, fetchEvents);
	const clearFilters = createClearFiltersAction(state, fetchEvents);
	const refresh = createRefreshAction(
		fetchEvents,
		fetchSessions,
		fetchUsers,
		fetchWebVitals,
	);

	// Auto-fetch on mount
	onMount(() => {
		void refresh();
	});

	return {
		fetchEvents,
		fetchSessions,
		fetchUsers,
		fetchWebVitals,
		trackEvent,
		identifyUser,
		setFilters,
		clearFilters,
		refresh,
	};
}
