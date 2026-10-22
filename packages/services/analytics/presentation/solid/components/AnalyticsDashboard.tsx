/**
 * AnalyticsDashboard - SolidJS component for analytics dashboard
 */

import {
	Badge,
	Button,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@wrikka/solid-ui";
import { createMemo, createSignal, Show, splitProps } from "solid-js";
import type {
	Event,
	Funnel,
	RetentionData,
	Session,
	WebVital,
} from "#analytics/modules/analytics/types";
import { EventsPanel } from "./AnalyticsDashboardEventsPanel";
import { FunnelsPanel } from "./AnalyticsDashboardFunnelsPanel";
import { OverviewPanel } from "./AnalyticsDashboardOverviewPanel";
import { RetentionPanel } from "./AnalyticsDashboardRetentionPanel";
import { SessionsPanel } from "./AnalyticsDashboardSessionsPanel";
import { WebVitalsPanel } from "./AnalyticsDashboardWebVitalsPanel";
import {
	calculateAverageSessionDuration,
	calculateTotalEvents,
	calculateTotalSessions,
	calculateWebVitalsScore,
} from "./analytics-dashboard-metrics";

type DashboardTab =
	| "overview"
	| "events"
	| "sessions"
	| "web-vitals"
	| "funnels"
	| "retention";

interface AnalyticsDashboardProps {
	events?: readonly Event[];
	sessions?: readonly Session[];
	webVitals?: readonly WebVital[];
	funnels?: readonly Funnel[];
	retentionData?: readonly RetentionData[];
	onRefresh?: () => void;
	dateRange?: { start: Date; end: Date };
}

export function AnalyticsDashboard(props: AnalyticsDashboardProps) {
	const [local] = splitProps(props, [
		"events",
		"sessions",
		"webVitals",
		"funnels",
		"retentionData",
		"onRefresh",
		"dateRange",
	]);

	const [selectedTab, setSelectedTab] = createSignal<DashboardTab>("overview");
	const [isLoading, setIsLoading] = createSignal(false);

	const totalEvents = createMemo(() => calculateTotalEvents(local.events));
	const totalSessions = createMemo(() =>
		calculateTotalSessions(local.sessions),
	);
	const averageSessionDuration = createMemo(() =>
		calculateAverageSessionDuration(local.sessions),
	);
	const webVitalsScore = createMemo(() =>
		calculateWebVitalsScore(local.webVitals),
	);

	const handleRefresh = async () => {
		setIsLoading(true);
		try {
			await local.onRefresh?.();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div class="analytics-dashboard">
			<div class="dashboard-header">
				<h1 class="dashboard-title">Analytics Dashboard</h1>
				<div class="dashboard-actions">
					<Show when={local.dateRange}>
						<Badge class="date-range">
							{local.dateRange?.start.toLocaleDateString()} -{" "}
							{local.dateRange?.end.toLocaleDateString()}
						</Badge>
					</Show>
					<Button
						class="refresh-button"
						onClick={handleRefresh}
						disabled={isLoading()}
					>
						{isLoading() ? "Refreshing..." : "Refresh"}
					</Button>
				</div>
			</div>

			<Tabs
				class="dashboard-tabs"
				value={selectedTab()}
				onValueChange={(value) => setSelectedTab(value as DashboardTab)}
			>
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="events">Events ({totalEvents()})</TabsTrigger>
					<TabsTrigger value="sessions">
						Sessions ({totalSessions()})
					</TabsTrigger>
					<TabsTrigger value="web-vitals">Web Vitals</TabsTrigger>
					<TabsTrigger value="funnels">Funnels</TabsTrigger>
					<TabsTrigger value="retention">Retention</TabsTrigger>
				</TabsList>

				<div class="dashboard-content">
					<TabsContent value="overview">
						<OverviewPanel
							totalEvents={totalEvents()}
							totalSessions={totalSessions()}
							averageSessionDuration={averageSessionDuration()}
							webVitalsScore={webVitalsScore()}
						/>
					</TabsContent>

					<TabsContent value="events">
						<EventsPanel
							{...(local.events !== undefined && { events: local.events })}
						/>
					</TabsContent>

					<TabsContent value="sessions">
						<SessionsPanel
							{...(local.sessions !== undefined && {
								sessions: local.sessions,
							})}
						/>
					</TabsContent>

					<TabsContent value="web-vitals">
						<WebVitalsPanel
							{...(local.webVitals !== undefined && {
								webVitals: local.webVitals,
							})}
						/>
					</TabsContent>

					<TabsContent value="funnels">
						<FunnelsPanel
							{...(local.funnels !== undefined && { funnels: local.funnels })}
						/>
					</TabsContent>

					<TabsContent value="retention">
						<RetentionPanel
							{...(local.retentionData !== undefined && {
								retentionData: local.retentionData,
							})}
						/>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
