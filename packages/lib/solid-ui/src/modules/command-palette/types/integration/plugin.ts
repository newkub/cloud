/**
 * Plugin Types - Domain types for plugin system
 */

import type { Command } from "../command";

// Plugin types
export interface Plugin {
	readonly id: string;
	readonly name: string;
	readonly version: string;
	readonly description?: string;
	readonly author?: string;
	readonly commands: readonly Command[];
	readonly enabled: boolean;
	readonly config?: PluginConfig;
	readonly dependencies?: readonly string[];
	readonly permissions?: readonly PluginPermission[];
	readonly installedAt: Date;
	readonly updatedAt: Date;
}

export interface PluginConfig {
	readonly [key: string]: unknown;
}

export interface PluginPermission {
	readonly type: "read" | "write" | "execute" | "network";
	readonly resource: string;
	readonly description?: string;
}

export interface PluginMetadata {
	readonly id: string;
	readonly name: string;
	readonly version: string;
	readonly author?: string;
	readonly description?: string;
	readonly dependencies?: readonly string[];
	readonly permissions?: readonly PluginPermission[];
}

// Plugin registry types
export interface PluginRegistry {
	readonly plugins: readonly Plugin[];
	readonly installedPlugins: readonly string[];
	readonly activePlugins: readonly string[];
}

// Plugin loading types
export interface PluginLoadResult {
	readonly plugin: Plugin;
	readonly success: boolean;
	readonly error?: string;
}

export interface PluginUnloadResult {
	readonly pluginId: string;
	readonly success: boolean;
	readonly error?: string;
}

// Plugin state
export interface PluginState {
	readonly registry: PluginRegistry;
	readonly lastUpdated: Date;
}
