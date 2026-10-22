/**
 * SyncStatus — chip showing sync state (synced/syncing/error) with last-synced time and a manual sync button.
 */
import { type JSX, Match, Show, Switch, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type SyncState = "idle" | "synced" | "syncing" | "saving" | "saved" | "error";

const stateMap: Record<SyncState, { label: string; color: string }> = {
	idle: { label: "Idle", color: "text-muted-foreground" },
	synced: { label: "Synced", color: "text-success" },
	syncing: { label: "Syncing…", color: "text-info" },
	saving: { label: "Saving…", color: "text-info" },
	saved: { label: "Saved", color: "text-success" },
	error: { label: "Sync failed", color: "text-destructive" },
};

const formatTime = (value: Date | number | string) =>
	typeof value === "string" ? value : new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export interface SyncStatusProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Current sync state. */
	state: SyncState;
	/** Time of the last successful sync — Date, epoch ms, or a preformatted string. */
	lastSync?: Date | number | string;
	/** Text before the lastSync time @default "Last synced" */
	lastSyncPrefix?: string;
	/** Manual "Sync now" handler — the button is hidden when omitted. */
	onSync?: () => void;
	/** Corner radius. */
	radius?: Radius;
}

export function SyncStatus(props: SyncStatusProps) {
	const [local, rest] = splitProps(props, ["class", "state", "lastSync", "lastSyncPrefix", "onSync", "radius"]);
	const state = () => stateMap[local.state ?? "synced"];
	return (
		<div
			role="status"
			class={`solidui-sync-status inline-flex items-center gap-2 border border-border bg-surface px-2.5 py-1 text-xs ${radiusMap[local.radius ?? "full"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span class={`inline-flex h-3.5 w-3.5 shrink-0 ${state().color}`} aria-hidden="true">
				<Switch
					fallback={
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-3.5 w-3.5 motion-safe:animate-spin"
							aria-hidden="true"
						>
							<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
							<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
						</svg>
					}
				>
					<Match when={local.state === "idle"}>
						<span class="block h-2 w-2 rounded-full bg-muted-foreground" />
					</Match>
					<Match when={local.state === "synced" || local.state === "saved"}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-3.5 w-3.5"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="9" />
							<path d="m8.5 12.5 2.5 2.5 4.5-5" />
						</svg>
					</Match>
					<Match when={local.state === "error"}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-3.5 w-3.5"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="9" />
							<path d="M12 8v4" />
							<path d="M12 16h.01" />
						</svg>
					</Match>
				</Switch>
			</span>
			<span class={state().color}>{state().label}</span>
			<Show when={local.lastSync !== undefined}>
				<span class="tabular-nums text-muted-foreground">
					{local.lastSyncPrefix ?? "Last synced"} {formatTime(local.lastSync as Date | number | string)}
				</span>
			</Show>
			<Show when={local.onSync}>
				<button
					type="button"
					class="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-2xs transition-colors text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none disabled:opacity-50"
					disabled={local.state === "syncing" || local.state === "saving"}
					onClick={() => local.onSync?.()}
				>
					Sync now
				</button>
			</Show>
		</div>
	);
}
