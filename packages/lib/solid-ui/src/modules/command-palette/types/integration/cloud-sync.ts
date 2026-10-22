/**
 * Cloud Sync Types - Domain types for cloud synchronization
 */

import type { Command } from "../command";
import type { CommandPaletteSettings } from "../ui/theme";

// Cloud sync types
export interface CloudSyncConfig {
	readonly provider: "supabase" | "firebase" | "custom";
	readonly apiKey: string;
	readonly endpoint?: string;
	readonly bucket?: string;
	readonly syncInterval?: number; // milliseconds
}

export interface SyncData {
	readonly commands: readonly Command[];
	readonly history: readonly CommandHistoryEntry[];
	readonly settings: CommandPaletteSettings;
	readonly lastSyncAt: Date;
}

export interface CommandHistoryEntry {
	readonly id: string;
	readonly commandId: string;
	readonly executedAt: Date;
	readonly success: boolean;
	readonly result?: unknown;
	readonly error?: string;
}

// Sync status types
export interface SyncStatus {
	readonly isSyncing: boolean;
	readonly lastSyncAt?: Date;
	readonly lastSyncError?: string;
	readonly syncCount: number;
}

export interface SyncResult {
	readonly success: boolean;
	readonly syncedAt: Date;
	readonly error?: string;
	readonly itemsSynced?: number;
}

// Conflict resolution types
export interface SyncConflict {
	readonly type: "command" | "history" | "settings";
	readonly itemId: string;
	readonly localVersion: unknown;
	readonly remoteVersion: unknown;
	readonly conflictAt: Date;
}

export interface ConflictResolution {
	readonly strategy: "local" | "remote" | "merge" | "manual" | "newest";
	readonly resolvedAt: Date;
	readonly localData?: unknown;
	readonly remoteData?: unknown;
	readonly mergedData?: unknown;
}
