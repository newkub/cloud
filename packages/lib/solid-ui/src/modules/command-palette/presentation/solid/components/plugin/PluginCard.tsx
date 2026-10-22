import { For, Show } from "solid-js";
import type { PluginCardProps } from "./types";

export function PluginCard(props: PluginCardProps) {
	return (
		<div class={`plugin-card ${props.plugin.enabled ? "enabled" : "disabled"}`}>
			<div class="plugin-header">
				<div class="plugin-info">
					<h3 class="plugin-name">{props.plugin.name}</h3>
					<span class="plugin-version">v{props.plugin.version}</span>
				</div>
				<div class="plugin-status">
					<span class={`status-badge ${props.plugin.enabled ? "enabled" : "disabled"}`}>
						{props.plugin.enabled ? "Enabled" : "Disabled"}
					</span>
				</div>
			</div>

			<Show when={props.plugin.description}>
				<p class="plugin-description">{props.plugin.description}</p>
			</Show>

			<div class="plugin-commands">
				<span class="commands-count">{props.plugin.commands.length} commands</span>
				<Show when={props.plugin.commands.length > 0}>
					<div class="commands-preview">
						<For each={props.plugin.commands.slice(0, 3)}>
							{(command) => <span class="command-preview">{command.label}</span>}
						</For>
						<Show when={props.plugin.commands.length > 3}>
							<span class="commands-more">+{props.plugin.commands.length - 3} more</span>
						</Show>
					</div>
				</Show>
			</div>

			<div class="plugin-actions">
				<button
					class={`action-button toggle ${props.plugin.enabled ? "disable" : "enable"}`}
					onClick={() => props.onToggle(props.plugin.id)}
					type="button"
				>
					{props.plugin.enabled ? "Disable" : "Enable"}
				</button>
				<Show when={props.plugin.enabled}>
					<button class="action-button configure" onClick={() => props.onConfigure(props.plugin)} type="button">
						Configure
					</button>
				</Show>
			</div>
		</div>
	);
}
