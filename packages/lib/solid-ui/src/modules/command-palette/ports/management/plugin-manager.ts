/**
 * Plugin Manager Port - Interface for plugin system
 */

import type { Command } from "../../types";
import type {
	Plugin,
	PluginLoadResult,
	PluginMetadata,
	PluginRegistry,
	PluginUnloadResult,
} from "../../types/integration/plugin";

export interface PluginManager {
	registerPlugin(metadata: PluginMetadata): Promise<PluginLoadResult>;
	unregisterPlugin(pluginId: string): Promise<PluginUnloadResult>;
	getPlugin(pluginId: string): Plugin | undefined;
	listPlugins(): readonly Plugin[];
	enablePlugin(pluginId: string): boolean;
	disablePlugin(pluginId: string): boolean;
	getPluginCommands(pluginId: string): readonly Command[];
	getRegistry(): PluginRegistry;
}
