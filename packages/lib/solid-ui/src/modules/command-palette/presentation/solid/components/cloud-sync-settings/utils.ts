import type { CloudSyncConfig } from "../../../../types";

export function formatSyncInterval(ms: number): string {
	if (ms < 60000) return `${ms / 1000}s`;
	if (ms < 3600000) return `${ms / 60000}m`;
	return `${ms / 3600000}h`;
}

export function getProviderIcon(provider: CloudSyncConfig["provider"]): string {
	switch (provider) {
		case "supabase":
			return "⚡";
		case "firebase":
			return "🔥";
		case "custom":
			return "🔧";
		default:
			return "☁️";
	}
}
