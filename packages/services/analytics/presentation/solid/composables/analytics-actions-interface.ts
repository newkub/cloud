// Analytics actions interface

import type { Event, User } from "#analytics/modules/analytics/types";

export interface AnalyticsActions {
	fetchEvents: (page?: number) => Promise<void>;
	fetchSessions: (page?: number) => Promise<void>;
	fetchUsers: (page?: number) => Promise<void>;
	fetchWebVitals: (page?: number) => Promise<void>;
	trackEvent: (event: Omit<Event, "id" | "timestamp">) => Promise<void>;
	identifyUser: (
		user: Omit<User, "id" | "firstSeen" | "lastSeen">,
	) => Promise<void>;
	setFilters: (filters: Record<string, unknown>) => void;
	clearFilters: () => void;
	refresh: () => Promise<void>;
}
