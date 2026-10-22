/**
 * Cloud Sync Use Cases - Application orchestration
 * Handles cloud synchronization with validation and persistence
 */

import { mergeSyncData } from "../../../domain/operations/cloud-sync";
import type { CloudSyncRepository, EventDispatcher } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { CloudSyncConfig, SyncResult, SyncStatus } from "../../../types";

export interface UpdateCloudSyncConfigRequest {
	readonly provider: CloudSyncConfig["provider"];
	readonly apiKey: string;
	readonly endpoint?: string;
	readonly bucket?: string;
	readonly syncInterval?: number;
}

export const updateCloudSyncConfigUseCase =
	(cloudSyncRepository: CloudSyncRepository, _eventDispatcher: EventDispatcher) =>
	async (request: UpdateCloudSyncConfigRequest): Promise<Result<CloudSyncConfig>> => {
		try {
			// Step 1: Create config object
			const config: CloudSyncConfig = {
				provider: request.provider,
				apiKey: request.apiKey,
				endpoint: request.endpoint,
				bucket: request.bucket,
				syncInterval: request.syncInterval ?? 60000,
			};

			// Step 2: Validate config
			if (!config.apiKey || config.apiKey.trim().length === 0) {
				return {
					success: false,
					error: ValidationError("cloud-sync", "API key is required"),
				};
			}

			// Step 3: Save config
			const saveResult = await cloudSyncRepository.saveConfig(config);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError("updateCloudSyncConfig", "Failed to save cloud sync config", saveResult.error),
				};
			}

			// Step 4: Dispatch event
			// Note: Would need cloud sync config updated event type
			// const event = createCloudSyncConfigUpdatedEvent(config);
			// await eventDispatcher.dispatch(event);

			return { success: true, data: saveResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"updateCloudSyncConfig",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const syncNowUseCase =
	(cloudSyncRepository: CloudSyncRepository, _eventDispatcher: EventDispatcher) =>
	async (): Promise<Result<SyncResult>> => {
		try {
			// Step 1: Get current config
			const configResult = await cloudSyncRepository.getConfig();
			if (!configResult.success) {
				return {
					success: false,
					error: UseCaseError("syncNow", "Failed to get cloud sync config", configResult.error),
				};
			}

			if (!configResult.data) {
				return {
					success: false,
					error: new Error("Cloud sync config not found"),
				};
			}

			// Step 2: Get local data
			const localDataResult = await cloudSyncRepository.getLocalData();
			if (!localDataResult.success) {
				return {
					success: false,
					error: UseCaseError("syncNow", "Failed to get local data", localDataResult.error),
				};
			}

			// Step 3: Fetch remote data
			const remoteDataResult = await cloudSyncRepository.fetchRemoteData(configResult.data);
			if (!remoteDataResult.success) {
				return {
					success: false,
					error: UseCaseError("syncNow", "Failed to fetch remote data", remoteDataResult.error),
				};
			}

			// Step 4: Merge data
			const mergedData = mergeSyncData(localDataResult.data, remoteDataResult.data);

			// Step 5: Save merged data
			const saveResult = await cloudSyncRepository.saveLocalData(mergedData);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError("syncNow", "Failed to save merged data", saveResult.error),
				};
			}

			// Step 6: Update sync status
			const currentStatusResult = await cloudSyncRepository.getSyncStatus();
			const currentCount =
				currentStatusResult.success && currentStatusResult.data ? (currentStatusResult.data.syncCount ?? 0) : 0;

			await cloudSyncRepository.updateSyncStatus({
				isSyncing: false,
				lastSyncAt: new Date(),
				lastSyncError: undefined,
				syncCount: currentCount + 1,
			});

			const syncResult: SyncResult = {
				success: true,
				syncedAt: new Date(),
			};

			// Step 7: Dispatch event
			// Note: Would need sync completed event type
			// const event = createSyncCompletedEvent(syncResult);
			// await eventDispatcher.dispatch(event);

			return { success: true, data: syncResult };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError("syncNow", "Unexpected error", error instanceof Error ? error : new Error(String(error))),
			};
		}
	};

export const getSyncStatusUseCase =
	(cloudSyncRepository: CloudSyncRepository) => async (): Promise<Result<SyncStatus>> => {
		try {
			const statusResult = await cloudSyncRepository.getSyncStatus();
			if (!statusResult.success) {
				return {
					success: false,
					error: UseCaseError("getSyncStatus", "Failed to get sync status", statusResult.error),
				};
			}

			return { success: true, data: statusResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"getSyncStatus",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
