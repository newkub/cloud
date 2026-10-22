import type { PluginStatsProps } from "./types";

export function PluginStats(props: PluginStatsProps) {
	return (
		<div class="plugin-stats">
			<div class="stat-item">
				<span class="stat-label">Plugins:</span>
				<span class="stat-value">
					{props.enabledPlugins()}/{props.totalPlugins()}
				</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">Commands:</span>
				<span class="stat-value">{props.totalCommands()}</span>
			</div>
		</div>
	);
}
