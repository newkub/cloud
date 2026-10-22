/**
 * Cloud Sync Repository Port - Interface for cloud sync persistence
 * Defines contract for cloud sync storage operations
 */

import type { Result } from "../shared/types";
import type { CloudSyncConfig, SyncData, SyncStatus } from "../types";

export interface CloudSyncRepository {
	// Config operations
	saveConfig(config: CloudSyncConfig): Promise<Result<CloudSyncConfig>>;
	getConfig(): Promise<Result<CloudSyncConfig | null>>;
	deleteConfig(): Promise<Result<void>>;

	// Data operations
	saveLocalData(data: SyncData): Promise<Result<SyncData>>;
	getLocalData(): Promise<Result<SyncData>>;
	fetchRemoteData(config: CloudSyncConfig): Promise<Result<SyncData>>;
	pushRemoteData(config: CloudSyncConfig, data: SyncData): Promise<Result<void>>;

	// Status operations
	updateSyncStatus(status: Partial<SyncStatus>): Promise<Result<SyncStatus>>;
	getSyncStatus(): Promise<Result<SyncStatus>>;
}
