/**
 * CloudSyncSettings - SolidJS component for cloud sync configuration
 */

import { createSignal, Show, splitProps } from "solid-js";
import type { CloudSyncConfig, SyncStatus } from "../../../types";
import type { CloudSyncValidationErrors } from "./cloud-sync-settings/handlers";
import { createSettingsHandlers } from "./cloud-sync-settings/handlers";
import { SettingsForm } from "./cloud-sync-settings/SettingsForm";
import { SettingsSummary } from "./cloud-sync-settings/SettingsSummary";
import type { CloudSyncSettingsProps } from "./cloud-sync-settings/types";

interface CloudSyncHeaderProps {
	status?: SyncStatus;
}

function CloudSyncHeader(props: CloudSyncHeaderProps) {
	return (
		<div class="settings-header">
			<h2 class="settings-title">Cloud Sync Settings</h2>
			<div class="sync-status">
				<Show
					when={props.status?.isSyncing}
					fallback={
						<>
							<span class="status-indicator synced" />
							<span class="status-text">
								{props.status?.lastSyncAt
									? `Last synced: ${new Date(props.status.lastSyncAt).toLocaleString()}`
									: "Not synced"}
							</span>
						</>
					}
				>
					<span class="status-indicator syncing" />
					<span class="status-text">Syncing...</span>
				</Show>
			</div>
		</div>
	);
}

interface CloudSyncActionsProps {
	isEditing: boolean;
	isSyncing?: boolean;
	onSyncNow?: () => void;
	onEdit: () => void;
}

function CloudSyncActions(props: CloudSyncActionsProps) {
	return (
		<div class="settings-actions">
			<Show when={props.onSyncNow}>
				<button class="action-button sync" onClick={props.onSyncNow} disabled={props.isSyncing} type="button">
					Sync Now
				</button>
			</Show>
			<Show when={!props.isEditing}>
				<button class="action-button edit" onClick={props.onEdit} type="button">
					Edit Settings
				</button>
			</Show>
		</div>
	);
}

interface CloudSyncErrorProps {
	error?: string;
}

function CloudSyncError(props: CloudSyncErrorProps) {
	return (
		<div class="sync-error">
			<span class="error-label">Last Sync Error:</span>
			<span class="error-message">{props.error}</span>
		</div>
	);
}

interface CloudSyncStatsProps {
	syncCount?: number;
}

function CloudSyncStats(props: CloudSyncStatsProps) {
	return (
		<Show when={props.syncCount !== undefined}>
			<div class="sync-stats">
				<span class="stat-item">Total Syncs: {props.syncCount}</span>
			</div>
		</Show>
	);
}

function createCloudSyncState(
	config: CloudSyncConfig | undefined,
	onSaveConfig: ((config: CloudSyncConfig) => void) | undefined,
	onSyncNow: (() => void) | undefined,
) {
	const [provider, setProvider] = createSignal<CloudSyncConfig["provider"]>(config?.provider ?? "supabase");
	const [apiKey, setApiKey] = createSignal(config?.apiKey ?? "");
	const [endpoint, setEndpoint] = createSignal(config?.endpoint ?? "");
	const [bucket, setBucket] = createSignal(config?.bucket ?? "");
	const [syncInterval, setSyncInterval] = createSignal(config?.syncInterval ?? 60000);
	const [isEditing, setIsEditing] = createSignal(false);
	const [errors, setErrors] = createSignal<CloudSyncValidationErrors>({});

	const { handleSave, handleSyncNow, handleEdit, handleCancel } = createSettingsHandlers(
		config,
		provider,
		apiKey,
		endpoint,
		bucket,
		syncInterval,
		setProvider,
		setApiKey,
		setEndpoint,
		setBucket,
		setSyncInterval,
		setIsEditing,
		setErrors,
		onSaveConfig,
		onSyncNow,
	);

	return {
		provider,
		setProvider,
		apiKey,
		setApiKey,
		endpoint,
		setEndpoint,
		bucket,
		setBucket,
		syncInterval,
		setSyncInterval,
		isEditing,
		setIsEditing,
		errors,
		handleSave,
		handleSyncNow,
		handleEdit,
		handleCancel,
	};
}

export function CloudSyncSettings(props: CloudSyncSettingsProps) {
	const [local] = splitProps(props, ["config", "status", "onSaveConfig", "onSyncNow", "onResolveConflict"]);
	const state = createCloudSyncState(local.config, local.onSaveConfig, local.onSyncNow);

	return (
		<div class="cloud-sync-settings">
			<CloudSyncHeader status={local.status} />

			<CloudSyncActions
				isEditing={state.isEditing()}
				isSyncing={local.status?.isSyncing}
				onSyncNow={state.handleSyncNow}
				onEdit={state.handleEdit}
			/>

			<Show when={state.isEditing()}>
				<SettingsForm
					provider={state.provider()}
					apiKey={state.apiKey()}
					endpoint={state.endpoint()}
					bucket={state.bucket()}
					syncInterval={state.syncInterval()}
					errors={state.errors()}
					onProviderChange={state.setProvider}
					onApiKeyChange={state.setApiKey}
					onEndpointChange={state.setEndpoint}
					onBucketChange={state.setBucket}
					onSyncIntervalChange={state.setSyncInterval}
					onCancel={state.handleCancel}
					onSave={state.handleSave}
				/>
			</Show>

			<Show when={!state.isEditing() && local.config}>
				<SettingsSummary config={local.config} />
			</Show>

			<Show when={local.status?.lastSyncError}>
				<CloudSyncError error={local.status?.lastSyncError} />
			</Show>

			<CloudSyncStats syncCount={local.status?.syncCount} />
		</div>
	);
}

export type { CloudSyncSettingsProps };
