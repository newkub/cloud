// Retention panel component

import { Alert, Card, CardContent, Progress } from "@wrikka/solid-ui";
import { For, Show } from "solid-js";
import type { RetentionData } from "#analytics/modules/analytics/types";

interface RetentionPanelProps {
	retentionData?: readonly RetentionData[];
}

export function RetentionPanel(props: RetentionPanelProps) {
	return (
		<div class="retention-panel">
			<Show when={props.retentionData && props.retentionData.length > 0}>
				<For each={props.retentionData}>
					{(data) => (
						<Card class="retention-item">
							<CardContent>
								<div class="retention-cohort">{data.cohort}</div>
								<div class="retention-users">{data.totalUsers} users</div>
								<div class="retention-rates">
									<For each={data.retentionRates}>
										{(rate, index) => (
											<div class="retention-rate">
												<span>
													Day {index() + 1}: {rate.toFixed(1)}%
												</span>
												<Progress value={rate} />
											</div>
										)}
									</For>
								</div>
							</CardContent>
						</Card>
					)}
				</For>
			</Show>
			<Show when={!props.retentionData || props.retentionData.length === 0}>
				<Alert class="empty-state">No retention data available</Alert>
			</Show>
		</div>
	);
}
