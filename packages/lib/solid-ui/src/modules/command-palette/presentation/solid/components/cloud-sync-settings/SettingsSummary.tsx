import { Show } from "solid-js";
import type { CloudSyncConfig } from "../../../../types";
import { formatSyncInterval, getProviderIcon } from "./utils";

interface SettingsSummaryProps {
	config?: CloudSyncConfig;
}

export function SettingsSummary(props: SettingsSummaryProps) {
	return (
		<Show when={props.config}>
			{(config) => (
				<div class="settings-summary">
					<div class="summary-item">
						<span class="summary-label">Provider:</span>
						<span class="summary-value">
							{getProviderIcon(config().provider)} {config().provider}
						</span>
					</div>
					<div class="summary-item">
						<span class="summary-label">API Key:</span>
						<span class="summary-value">{config().apiKey ? "••••••••" : "Not set"}</span>
					</div>
					<Show when={config().endpoint}>
						<div class="summary-item">
							<span class="summary-label">Endpoint:</span>
							<span class="summary-value">{config().endpoint}</span>
						</div>
					</Show>
					<Show when={config().bucket}>
						<div class="summary-item">
							<span class="summary-label">Bucket:</span>
							<span class="summary-value">{config().bucket}</span>
						</div>
					</Show>
					<div class="summary-item">
						<span class="summary-label">Sync Interval:</span>
						<span class="summary-value">{formatSyncInterval(config().syncInterval ?? 60000)}</span>
					</div>
				</div>
			)}
		</Show>
	);
}
