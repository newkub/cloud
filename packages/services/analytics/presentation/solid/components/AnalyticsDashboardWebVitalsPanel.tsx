// Web vitals panel component

import { Alert, Badge, Card, CardContent } from "@wrikka/solid-ui";
import { For, Show } from "solid-js";
import type { WebVital } from "#analytics/modules/analytics/types";

interface WebVitalsPanelProps {
	webVitals?: readonly WebVital[];
}

export function WebVitalsPanel(props: WebVitalsPanelProps) {
	return (
		<div class="web-vitals-panel">
			<Show when={props.webVitals && props.webVitals.length > 0}>
				<div class="vitals-list">
					<For each={props.webVitals}>
						{(vital) => (
							<Card class={`vital-item vital-${vital.rating}`}>
								<CardContent>
									<div class="vital-name">{vital.name}</div>
									<div class="vital-value">{vital.value}</div>
									<Badge class="vital-rating">{vital.rating}</Badge>
									<div class="vital-path">{vital.path}</div>
								</CardContent>
							</Card>
						)}
					</For>
				</div>
			</Show>
			<Show when={!props.webVitals || props.webVitals.length === 0}>
				<Alert class="empty-state">No web vitals recorded</Alert>
			</Show>
		</div>
	);
}
