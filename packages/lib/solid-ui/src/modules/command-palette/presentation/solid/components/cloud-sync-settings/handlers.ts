import type { Accessor } from "solid-js";
import type { CloudSyncConfig } from "../../../../types";

export interface CloudSyncValidationErrors {
	apiKey?: string;
	endpoint?: string;
	bucket?: string;
	syncInterval?: string;
}

const KEY_REQUIRED = "Key is required.";
const ENDPOINT_REQUIRED = "Endpoint URL is required for custom providers.";
const ENDPOINT_INVALID = "Enter a valid endpoint URL.";
const BUCKET_REQUIRED = "Bucket is required.";
const INTERVAL_REQUIRED = "Sync interval must be at least 1 second.";

interface ValidationInput {
	provider: CloudSyncConfig["provider"];
	apiKey: string;
	endpoint: string;
	bucket: string;
	syncInterval: number;
}

function buildValidationInput(
	provider: Accessor<CloudSyncConfig["provider"]>,
	apiKey: Accessor<string>,
	endpoint: Accessor<string>,
	bucket: Accessor<string>,
	syncInterval: Accessor<number>,
): ValidationInput {
	return {
		provider: provider(),
		apiKey: apiKey().trim(),
		endpoint: endpoint().trim(),
		bucket: bucket().trim(),
		syncInterval: syncInterval(),
	};
}

function validate(input: ValidationInput): CloudSyncValidationErrors {
	const errors: CloudSyncValidationErrors = {};

	if (!input.apiKey) {
		errors.apiKey = KEY_REQUIRED;
	}

	if (input.provider === "custom") {
		if (!input.endpoint) {
			errors.endpoint = ENDPOINT_REQUIRED;
		} else if (!URL.canParse(input.endpoint)) {
			errors.endpoint = ENDPOINT_INVALID;
		}
	}

	if (input.provider === "supabase" || input.provider === "custom") {
		if (!input.bucket) {
			errors.bucket = BUCKET_REQUIRED;
		}
	}

	if (Number.isNaN(input.syncInterval) || input.syncInterval < 1000) {
		errors.syncInterval = INTERVAL_REQUIRED;
	}

	return errors;
}

function buildCloudConfig(input: ValidationInput): CloudSyncConfig {
	return {
		provider: input.provider,
		apiKey: input.apiKey,
		...(input.endpoint ? { endpoint: input.endpoint } : {}),
		...(input.bucket ? { bucket: input.bucket } : {}),
		syncInterval: input.syncInterval,
	};
}

function resetToConfig(
	config: CloudSyncConfig | undefined,
	setProvider: (provider: CloudSyncConfig["provider"]) => void,
	setApiKey: (key: string) => void,
	setEndpoint: (endpoint: string) => void,
	setBucket: (bucket: string) => void,
	setSyncInterval: (interval: number) => void,
) {
	if (config) {
		setProvider(config.provider);
		setApiKey(config.apiKey);
		setEndpoint(config.endpoint ?? "");
		setBucket(config.bucket ?? "");
		setSyncInterval(config.syncInterval ?? 60000);
	} else {
		setProvider("supabase");
		setApiKey("");
		setEndpoint("");
		setBucket("");
		setSyncInterval(60000);
	}
}

export function createSettingsHandlers(
	config: CloudSyncConfig | undefined,
	provider: Accessor<CloudSyncConfig["provider"]>,
	apiKey: Accessor<string>,
	endpoint: Accessor<string>,
	bucket: Accessor<string>,
	syncInterval: Accessor<number>,
	setProvider: (provider: CloudSyncConfig["provider"]) => void,
	setApiKey: (key: string) => void,
	setEndpoint: (endpoint: string) => void,
	setBucket: (bucket: string) => void,
	setSyncInterval: (interval: number) => void,
	setIsEditing: (editing: boolean) => void,
	setErrors: (errors: CloudSyncValidationErrors) => void,
	onSaveConfig?: (config: CloudSyncConfig) => void,
	onSyncNow?: () => void,
) {
	const handleSave = () => {
		const input = buildValidationInput(provider, apiKey, endpoint, bucket, syncInterval);
		const errors = validate(input);
		setErrors(errors);
		if (Object.keys(errors).length > 0) {
			return;
		}

		onSaveConfig?.(buildCloudConfig(input));
		setIsEditing(false);
		setErrors({});
	};

	const handleSyncNow = () => {
		onSyncNow?.();
	};

	const handleEdit = () => {
		setIsEditing(true);
		setErrors({});
	};

	const handleCancel = () => {
		setIsEditing(false);
		setErrors({});
		resetToConfig(config, setProvider, setApiKey, setEndpoint, setBucket, setSyncInterval);
	};

	return { handleSave, handleSyncNow, handleEdit, handleCancel };
}
