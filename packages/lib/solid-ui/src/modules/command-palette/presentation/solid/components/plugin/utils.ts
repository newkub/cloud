import type { Plugin } from "../../../../types";

export function filterPlugins(plugins: readonly Plugin[], showInstalledOnly: boolean): readonly Plugin[] {
	if (showInstalledOnly) {
		return plugins.filter((p) => p.enabled);
	}
	return plugins;
}

export function countEnabledPlugins(plugins: readonly Plugin[]): number {
	return plugins.filter((p) => p.enabled).length;
}

export function countTotalCommands(plugins: readonly Plugin[]): number {
	return plugins.reduce((sum, plugin) => sum + plugin.commands.length, 0);
}
