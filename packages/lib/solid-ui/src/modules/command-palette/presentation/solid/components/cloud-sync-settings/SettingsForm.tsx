import { Show } from "solid-js";
import { ENDPOINT_PLACEHOLDER } from "../../../../constants";
import type { CloudSyncConfig } from "../../../../types";
import type { CloudSyncValidationErrors } from "./handlers";
import { formatSyncInterval } from "./utils";

interface SettingsFormProps {
	provider: CloudSyncConfig["provider"];
	apiKey: string;
	endpoint: string;
	bucket: string;
	syncInterval: number;
	errors: CloudSyncValidationErrors;
	onProviderChange: (value: CloudSyncConfig["provider"]) => void;
	onApiKeyChange: (value: string) => void;
	onEndpointChange: (value: string) => void;
	onBucketChange: (value: string) => void;
	onSyncIntervalChange: (value: number) => void;
	onCancel: () => void;
	onSave: () => void;
}

function FieldError(props: { message?: string }) {
	return (
		<Show when={props.message}>
			<span class="form-error" role="alert">
				{props.message}
			</span>
		</Show>
	);
}

interface ProviderSelectProps {
	provider: CloudSyncConfig["provider"];
	onProviderChange: (value: CloudSyncConfig["provider"]) => void;
}

function ProviderSelect(props: ProviderSelectProps) {
	return (
		<div class="form-group">
			<label for="sync-provider" class="form-label">
				Provider
			</label>
			<select
				id="sync-provider"
				value={props.provider}
				onChange={(e) => props.onProviderChange(e.currentTarget.value as CloudSyncConfig["provider"])}
				class="form-select"
			>
				<option value="supabase">Supabase</option>
				<option value="firebase">Firebase</option>
				<option value="custom">Custom</option>
			</select>
		</div>
	);
}

interface ApiKeyInputProps {
	apiKey: string;
	error?: string;
	onApiKeyChange: (value: string) => void;
}

function ApiKeyInput(props: ApiKeyInputProps) {
	return (
		<div class="form-group">
			<label for="sync-api-key" class="form-label">
				API Key
			</label>
			<input
				id="sync-api-key"
				type="password"
				value={props.apiKey}
				onInput={(e) => props.onApiKeyChange(e.currentTarget.value)}
				class="form-input"
				classList={{ "is-invalid": Boolean(props.error) }}
				placeholder="Enter your API key"
				aria-invalid={Boolean(props.error)}
				aria-describedby={props.error ? "sync-api-key-error" : undefined}
			/>
			<FieldError message={props.error} />
		</div>
	);
}

interface EndpointInputProps {
	provider: CloudSyncConfig["provider"];
	endpoint: string;
	error?: string;
	onEndpointChange: (value: string) => void;
}

function EndpointInput(props: EndpointInputProps) {
	return (
		<Show when={props.provider === "custom"}>
			<div class="form-group">
				<label for="sync-endpoint" class="form-label">
					Endpoint
				</label>
				<input
					id="sync-endpoint"
					type="url"
					value={props.endpoint}
					onInput={(e) => props.onEndpointChange(e.currentTarget.value)}
					class="form-input"
					classList={{ "is-invalid": Boolean(props.error) }}
					placeholder={ENDPOINT_PLACEHOLDER}
					aria-invalid={Boolean(props.error)}
					aria-describedby={props.error ? "sync-endpoint-error" : undefined}
				/>
				<FieldError message={props.error} />
			</div>
		</Show>
	);
}

interface BucketInputProps {
	provider: CloudSyncConfig["provider"];
	bucket: string;
	error?: string;
	onBucketChange: (value: string) => void;
}

function BucketInput(props: BucketInputProps) {
	return (
		<Show when={props.provider === "supabase" || props.provider === "custom"}>
			<div class="form-group">
				<label for="sync-bucket" class="form-label">
					Bucket
				</label>
				<input
					id="sync-bucket"
					type="text"
					value={props.bucket}
					onInput={(e) => props.onBucketChange(e.currentTarget.value)}
					class="form-input"
					classList={{ "is-invalid": Boolean(props.error) }}
					placeholder="storage-bucket"
					aria-invalid={Boolean(props.error)}
					aria-describedby={props.error ? "sync-bucket-error" : undefined}
				/>
				<FieldError message={props.error} />
			</div>
		</Show>
	);
}

interface SyncIntervalInputProps {
	syncInterval: number;
	error?: string;
	onSyncIntervalChange: (value: number) => void;
}

function SyncIntervalInput(props: SyncIntervalInputProps) {
	return (
		<div class="form-group">
			<label for="sync-interval" class="form-label">
				Sync Interval
			</label>
			<input
				id="sync-interval"
				type="number"
				value={props.syncInterval}
				onChange={(e) => props.onSyncIntervalChange(Number.parseInt(e.currentTarget.value, 10))}
				class="form-input"
				classList={{ "is-invalid": Boolean(props.error) }}
				min="1000"
				step="1000"
				aria-invalid={Boolean(props.error)}
				aria-describedby={props.error ? "sync-interval-error" : undefined}
			/>
			<span class="form-hint">Current: {formatSyncInterval(props.syncInterval)}</span>
			<FieldError message={props.error} />
		</div>
	);
}

interface SettingsFormActionsProps {
	onCancel: () => void;
	onSave: () => void;
}

function SettingsFormActions(props: SettingsFormActionsProps) {
	return (
		<div class="form-actions">
			<button class="action-button cancel" onClick={props.onCancel} type="button">
				Cancel
			</button>
			<button class="action-button save" onClick={props.onSave} type="button">
				Save Settings
			</button>
		</div>
	);
}

export function SettingsForm(props: SettingsFormProps) {
	return (
		<div class="settings-form">
			<ProviderSelect provider={props.provider} onProviderChange={props.onProviderChange} />
			<ApiKeyInput apiKey={props.apiKey} error={props.errors.apiKey} onApiKeyChange={props.onApiKeyChange} />
			<EndpointInput
				provider={props.provider}
				endpoint={props.endpoint}
				error={props.errors.endpoint}
				onEndpointChange={props.onEndpointChange}
			/>
			<BucketInput
				provider={props.provider}
				bucket={props.bucket}
				error={props.errors.bucket}
				onBucketChange={props.onBucketChange}
			/>
			<SyncIntervalInput
				syncInterval={props.syncInterval}
				error={props.errors.syncInterval}
				onSyncIntervalChange={props.onSyncIntervalChange}
			/>
			<SettingsFormActions onCancel={props.onCancel} onSave={props.onSave} />
		</div>
	);
}
