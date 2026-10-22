/**
 * PluginManager - SolidJS component for command palette plugin management
 */

import { createMemo, createSignal, For, Show, splitProps } from "solid-js";
import type { Plugin } from "../../../../types";
import { PluginCard } from "./PluginCard";
import { PluginDetailsPanel } from "./PluginDetailsPanel";
import { PluginFilterControl } from "./PluginFilterControl";
import { PluginStats } from "./PluginStats";
import type { PluginManagerProps } from "./types";
import { countEnabledPlugins, countTotalCommands, filterPlugins } from "./utils";

export function PluginManager(props: PluginManagerProps) {
	const [local] = splitProps(props, [
		"plugins",
		"onTogglePlugin",
		"onInstallPlugin",
		"onUninstallPlugin",
		"onConfigurePlugin",
	]);

	const [selectedPlugin, setSelectedPlugin] = createSignal<Plugin | null>(null);
	const [showInstalledOnly, setShowInstalledOnly] = createSignal(false);

	const filteredPlugins = createMemo(() => filterPlugins(local.plugins, showInstalledOnly()));
	const enabledPlugins = createMemo(() => countEnabledPlugins(local.plugins));
	const totalCommands = createMemo(() => countTotalCommands(local.plugins));

	const handleTogglePlugin = (pluginId: string) => {
		local.onTogglePlugin?.(pluginId);
	};

	const handleConfigurePlugin = (plugin: Plugin) => {
		setSelectedPlugin(plugin);
		local.onConfigurePlugin?.(plugin.id);
	};

	return (
		<div class="plugin-manager">
			<div class="plugin-header">
				<h2 class="plugin-title">Plugin Manager</h2>
				<PluginStats
					enabledPlugins={enabledPlugins}
					totalPlugins={() => local.plugins.length}
					totalCommands={totalCommands}
				/>
			</div>

			<PluginFilterControl showInstalledOnly={showInstalledOnly} setShowInstalledOnly={setShowInstalledOnly} />

			<div class="plugin-list">
				<For each={filteredPlugins()}>
					{(plugin) => <PluginCard plugin={plugin} onToggle={handleTogglePlugin} onConfigure={handleConfigurePlugin} />}
				</For>
			</div>

			<Show when={selectedPlugin()}>
				<PluginDetailsPanel plugin={selectedPlugin} onClose={() => setSelectedPlugin(null)} />
			</Show>
		</div>
	);
}
