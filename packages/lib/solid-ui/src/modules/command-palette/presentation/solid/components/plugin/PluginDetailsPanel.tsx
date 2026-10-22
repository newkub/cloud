import { For, Show } from "solid-js";
import type { PluginDetailsPanelProps } from "./types";

export function PluginDetailsPanel(props: PluginDetailsPanelProps) {
	return (
		<div class="plugin-details-panel">
			<h3 class="panel-title">Plugin Details</h3>
			<div class="plugin-details">
				<div class="detail-row">
					<span class="detail-label">Name:</span>
					<span class="detail-value">{props.plugin()?.name}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Version:</span>
					<span class="detail-value">{props.plugin()?.version}</span>
				</div>
				<Show when={props.plugin()?.description}>
					<div class="detail-row">
						<span class="detail-label">Description:</span>
						<span class="detail-value">{props.plugin()?.description}</span>
					</div>
				</Show>
			</div>

			<h4 class="section-title">Commands</h4>
			<div class="plugin-commands-list">
				<For each={props.plugin()?.commands || []}>
					{(command) => (
						<div class="plugin-command-item">
							<span class="command-label">{command.label}</span>
							<Show when={command.description}>
								<span class="command-desc">{command.description}</span>
							</Show>
							<Show when={command.hotkey}>
								<span class="command-hotkey">{command.hotkey}</span>
							</Show>
						</div>
					)}
				</For>
			</div>

			<button class="close-button" onClick={props.onClose} type="button">
				Close
			</button>
		</div>
	);
}
