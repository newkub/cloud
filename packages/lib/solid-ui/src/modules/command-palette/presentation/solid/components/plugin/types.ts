import type { Plugin } from "../../../../types";

export interface PluginManagerProps {
	plugins: readonly Plugin[];
	onTogglePlugin?: (pluginId: string) => void;
	onInstallPlugin?: (pluginId: string) => void;
	onUninstallPlugin?: (pluginId: string) => void;
	onConfigurePlugin?: (pluginId: string) => void;
}

export interface PluginCardProps {
	plugin: Plugin;
	onToggle: (pluginId: string) => void;
	onConfigure: (plugin: Plugin) => void;
}

export interface PluginStatsProps {
	enabledPlugins: () => number;
	totalPlugins: () => number;
	totalCommands: () => number;
}

export interface PluginFilterControlProps {
	showInstalledOnly: () => boolean;
	setShowInstalledOnly: (value: boolean) => void;
}

export interface PluginDetailsPanelProps {
	plugin: () => Plugin | null | undefined;
	onClose: () => void;
}
