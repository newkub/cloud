// ============================================================================
// Analytics State Management Composable - SolidJS
// ============================================================================

import { createSignal } from "solid-js";
import type {
	Event,
	EventType,
	Funnel,
	RetentionData,
	Session,
	User,
	WebVital,
} from "#analytics/modules/analytics/types";

export interface AnalyticsData {
	events: readonly Event[];
	sessions: readonly Session[];
	users: readonly User[];
	webVitals: readonly WebVital[];
	funnels: readonly Funnel[];
	retentionData: readonly RetentionData[];
	metrics: Record<string, number>;
}

export interface AnalyticsFilter {
	eventType?: EventType;
	userId?: string;
	sessionId?: string;
	startDate?: number;
	endDate?: number;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	[key: string]: unknown;
}

export interface AnalyticsState {
	data: () => AnalyticsData;
	loading: () => boolean;
	error: () => string | null;
	currentPage: () => number;
	totalPages: () => number;
	totalItems: () => number;
	hasMore: () => boolean;
	filters: () => AnalyticsFilter;
}

export interface AnalyticsStateMutators {
	setLoading: (value: boolean) => void;
	setError: (value: string | null) => void;
	setData: (data: AnalyticsData) => void;
	setPagination: (page: number, totalPages: number, total: number) => void;
	setFilters: (newFilters: Record<string, unknown>) => void;
	setHasMore: (value: boolean) => void;
	clearFilters: () => void;
}

export function useAnalyticsState(): AnalyticsState & AnalyticsStateMutators {
	const [data, setData] = createSignal<AnalyticsData>({
		events: [],
		sessions: [],
		users: [],
		webVitals: [],
		funnels: [],
		retentionData: [],
		metrics: {},
	});
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);
	const [currentPage, setCurrentPage] = createSignal(1);
	const [totalPages, setTotalPages] = createSignal(1);
	const [totalItems, setTotalItems] = createSignal(0);
	const [hasMore, setHasMore] = createSignal(false);
	const [filters, setFilters] = createSignal<AnalyticsFilter>({});

	const setPagination = (page: number, pages: number, total: number) => {
		setCurrentPage(page);
		setTotalPages(pages);
		setTotalItems(total);
	};

	const setFiltersWrapper = (newFilters: AnalyticsFilter) => {
		setFilters(newFilters);
		setCurrentPage(1);
	};

	const clearFiltersWrapper = () => {
		setFilters({});
		setCurrentPage(1);
	};

	const setHasMoreWrapper = (value: boolean) => {
		setHasMore(value);
	};

	return {
		// State (as accessors)
		data,
		loading,
		error,
		currentPage,
		totalPages,
		totalItems,
		hasMore,
		filters,
		// Mutators
		setLoading,
		setError,
		setData,
		setPagination,
		setFilters: setFiltersWrapper,
		setHasMore: setHasMoreWrapper,
		clearFilters: clearFiltersWrapper,
	};
}
