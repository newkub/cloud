/**
 * Cloud Sync Port - Interface for cloud synchronization
 */

import type {
	ConflictResolution,
	SyncConflict,
	SyncData,
	SyncResult,
	SyncStatus,
} from "../types/integration/cloud-sync";

export interface CloudSync {
	sync(data: SyncData): Promise<SyncResult>;
	pull(): Promise<SyncData>;
	push(data: SyncData): Promise<SyncResult>;
	getStatus(): SyncStatus;
	resolveConflict(conflict: SyncConflict, resolution: ConflictResolution): Promise<boolean>;
}
