/**
 * Plugin Operations - Domain operations for plugin system
 */

import type { Result } from "../../../shared/types";
import type { Command } from "../../../types/command";
import type { Plugin, PluginMetadata, PluginPermission, PluginRegistry } from "../../../types/integration/plugin";

// Create plugin from metadata
export const createPlugin = (metadata: PluginMetadata, commands: readonly Command[]): Result<Plugin> => {
	if (!metadata.id || metadata.id.trim().length === 0) {
		return { success: false, error: new Error("Plugin ID is required") };
	}

	if (!metadata.name || metadata.name.trim().length === 0) {
		return { success: false, error: new Error("Plugin name is required") };
	}

	const plugin: Plugin = {
		id: metadata.id,
		name: metadata.name,
		version: metadata.version,
		description: metadata.description,
		author: metadata.author,
		commands,
		enabled: true,
		config: {},
		dependencies: metadata.dependencies,
		permissions: metadata.permissions,
		installedAt: new Date(),
		updatedAt: new Date(),
	};

	return { success: true, data: plugin };
};

// Register plugin in registry
export const registerPlugin = (registry: PluginRegistry, plugin: Plugin): PluginRegistry => {
	const existingPlugin = registry.plugins.find((p) => p.id === plugin.id);
	if (existingPlugin) {
		// Update existing plugin
		const updatedPlugins = registry.plugins.map((p) => (p.id === plugin.id ? plugin : p));
		return {
			...registry,
			plugins: updatedPlugins,
		};
	}

	// Add new plugin
	return {
		...registry,
		plugins: [...registry.plugins, plugin],
		installedPlugins: [...registry.installedPlugins, plugin.id],
		activePlugins: plugin.enabled ? [...registry.activePlugins, plugin.id] : registry.activePlugins,
	};
};

// Unregister plugin from registry
export const unregisterPlugin = (registry: PluginRegistry, pluginId: string): PluginRegistry => {
	return {
		...registry,
		plugins: registry.plugins.filter((p) => p.id !== pluginId),
		installedPlugins: registry.installedPlugins.filter((id) => id !== pluginId),
		activePlugins: registry.activePlugins.filter((id) => id !== pluginId),
	};
};

// Enable plugin
export const enablePlugin = (registry: PluginRegistry, pluginId: string): PluginRegistry => {
	const plugin = registry.plugins.find((p) => p.id === pluginId);
	if (!plugin) {
		return registry;
	}

	const updatedPlugin: Plugin = {
		...plugin,
		enabled: true,
		updatedAt: new Date(),
	};
	const updatedPlugins = registry.plugins.map((p) => (p.id === pluginId ? updatedPlugin : p));

	return {
		...registry,
		plugins: updatedPlugins,
		activePlugins: [...registry.activePlugins, pluginId],
	};
};

// Disable plugin
export const disablePlugin = (registry: PluginRegistry, pluginId: string): PluginRegistry => {
	const plugin = registry.plugins.find((p) => p.id === pluginId);
	if (!plugin) {
		return registry;
	}

	const updatedPlugin: Plugin = {
		...plugin,
		enabled: false,
		updatedAt: new Date(),
	};
	const updatedPlugins = registry.plugins.map((p) => (p.id === pluginId ? updatedPlugin : p));

	return {
		...registry,
		plugins: updatedPlugins,
		activePlugins: registry.activePlugins.filter((id) => id !== pluginId),
	};
};

// Get plugin commands
export const getPluginCommands = (registry: PluginRegistry, pluginId: string): readonly Command[] => {
	const plugin = registry.plugins.find((p) => p.id === pluginId);
	if (!plugin?.enabled) {
		return [];
	}
	return plugin.commands;
};

// Get all enabled plugin commands
export const getAllEnabledPluginCommands = (registry: PluginRegistry): readonly Command[] => {
	return registry.plugins.filter((p) => p.enabled).flatMap((p) => p.commands);
};

// Validate plugin dependencies
export const validatePluginDependencies = (plugin: Plugin, availablePlugins: readonly string[]): boolean => {
	if (!plugin.dependencies || plugin.dependencies.length === 0) {
		return true;
	}

	return plugin.dependencies.every((dep) => availablePlugins.includes(dep));
};

// Check plugin permissions
export const checkPluginPermissions = (plugin: Plugin, requiredPermissions: readonly string[]): boolean => {
	if (!plugin.permissions || plugin.permissions.length === 0) {
		return true;
	}

	const pluginPermissionTypes = plugin.permissions.map((p) => p.type);
	return requiredPermissions.every((perm) => pluginPermissionTypes.includes(perm as PluginPermission["type"]));
};
