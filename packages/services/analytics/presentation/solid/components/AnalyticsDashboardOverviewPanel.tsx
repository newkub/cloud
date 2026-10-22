// Overview panel component

import { Stat } from "@wrikka/solid-ui";

interface OverviewPanelProps {
	totalEvents: number;
	totalSessions: number;
	averageSessionDuration: number;
	webVitalsScore: number;
}

export function OverviewPanel(props: OverviewPanelProps) {
	return (
		<div class="overview-panel">
			<div class="metrics-grid">
				<Stat
					class="metric-card"
					label="Total Events"
					value={props.totalEvents}
				/>
				<Stat
					class="metric-card"
					label="Total Sessions"
					value={props.totalSessions}
				/>
				<Stat
					class="metric-card"
					label="Avg Session Duration"
					value={`${props.averageSessionDuration}s`}
				/>
				<Stat
					class="metric-card"
					label="Web Vitals Score"
					value={`${props.webVitalsScore}%`}
				/>
			</div>
		</div>
	);
}
