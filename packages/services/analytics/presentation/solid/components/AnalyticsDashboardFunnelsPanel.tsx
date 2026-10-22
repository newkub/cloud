// Funnels panel component

import { Alert, Card, CardContent, Progress } from "@wrikka/solid-ui";
import { For, Show } from "solid-js";
import type { Funnel } from "#analytics/modules/analytics/types";

interface FunnelsPanelProps {
	funnels?: readonly Funnel[];
}

export function FunnelsPanel(props: FunnelsPanelProps) {
	return (
		<div class="funnels-panel">
			<Show when={props.funnels && props.funnels.length > 0}>
				<For each={props.funnels}>
					{(funnel) => (
						<Card class="funnel-item">
							<CardContent>
								<div class="funnel-name">{funnel.name}</div>
								<div class="funnel-conversion">
									{funnel.overallConversionRate?.toFixed(1) ?? "N/A"}%
									conversion
								</div>
								<div class="funnel-steps">
									<For each={funnel.steps}>
										{(step) => (
											<div class="funnel-step">
												<div class="step-name">{step.name}</div>
												<div class="step-count">{step.count}</div>
												<div class="step-conversion">
													{step.conversionRate?.toFixed(1) ?? "N/A"}%
												</div>
												<Progress value={step.conversionRate ?? 0} />
											</div>
										)}
									</For>
								</div>
							</CardContent>
						</Card>
					)}
				</For>
			</Show>
			<Show when={!props.funnels || props.funnels.length === 0}>
				<Alert class="empty-state">No funnels configured</Alert>
			</Show>
		</div>
	);
}
