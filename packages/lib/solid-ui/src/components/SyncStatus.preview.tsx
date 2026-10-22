/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SyncStatus } from "./SyncStatus";

export const preview = (): JSX.Element => (
	<div class="flex flex-wrap items-center gap-2">
		<SyncStatus state="synced" lastSync={new Date()} onSync={() => {}} />
		<SyncStatus state="syncing" lastSync="10:42" onSync={() => {}} />
		<SyncStatus state="error" lastSync="09:15" onSync={() => {}} />
	</div>
);
