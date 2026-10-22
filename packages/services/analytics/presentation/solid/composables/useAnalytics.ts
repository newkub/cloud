// ============================================================================
// SolidJS Analytics Composable - Clean Architecture Adapter
// ============================================================================

import type {
	EventRepository,
	SessionRepository,
	UserRepository,
} from "#analytics/modules/analytics/ports";
import type { Event, User } from "#analytics/modules/analytics/types";
import { useAnalyticsActions } from "./useAnalyticsActions";
import { useAnalyticsState } from "./useAnalyticsState";

export interface UseAnalyticsReturn {
	// State
	data: () => import("./useAnalyticsState").AnalyticsData;
	loading: () => boolean;
	error: () => string | null;
	currentPage: () => number;
	totalPages: () => number;
	totalItems: () => number;
	hasMore: () => boolean;
	filters: () => import("./useAnalyticsState").AnalyticsFilter;

	// Actions
	fetchEvents: (page?: number) => Promise<void>;
	fetchSessions: (page?: number) => Promise<void>;
	fetchUsers: (page?: number) => Promise<void>;
	fetchWebVitals: (page?: number) => Promise<void>;
	trackEvent: (event: Omit<Event, "id" | "timestamp">) => Promise<void>;
	identifyUser: (
		user: Omit<User, "id" | "firstSeen" | "lastSeen">,
	) => Promise<void>;
	setFilters: (filters: import("./useAnalyticsState").AnalyticsFilter) => void;
	clearFilters: () => void;
	refresh: () => Promise<void>;
}

/**
 * Main analytics composable - composed from smaller, focused composables
 * @param eventRepository - Event repository instance
 * @param sessionRepository - Session repository instance
 * @param userRepository - User repository instance
 * @returns UseAnalyticsReturn
 */
export const useAnalytics = (
	eventRepository: EventRepository,
	sessionRepository: SessionRepository,
	userRepository: UserRepository,
): UseAnalyticsReturn => {
	const state = useAnalyticsState();
	const actions = useAnalyticsActions(
		eventRepository,
		sessionRepository,
		userRepository,
	);

	return {
		// State
		data: state.data,
		loading: state.loading,
		error: state.error,
		currentPage: state.currentPage,
		totalPages: state.totalPages,
		totalItems: state.totalItems,
		hasMore: state.hasMore,
		filters: state.filters,

		// Actions
		fetchEvents: actions.fetchEvents,
		fetchSessions: actions.fetchSessions,
		fetchUsers: actions.fetchUsers,
		fetchWebVitals: actions.fetchWebVitals,
		trackEvent: actions.trackEvent,
		identifyUser: actions.identifyUser,
		setFilters: actions.setFilters,
		clearFilters: actions.clearFilters,
		refresh: actions.refresh,
	};
};
