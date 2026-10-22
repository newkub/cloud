/**
 * SaveIndicator — autosave pill showing idle/saving/saved/error with a saved-at timestamp.
 * @deprecated Use `SyncStatus` — it accepts the same states plus `onSync`.
 */
import { type JSX, splitProps } from "solid-js";
import type { Radius } from "../lib/variants";
import { SyncStatus } from "./SyncStatus";

export type SaveState = "idle" | "saving" | "saved" | "error";

export interface SaveIndicatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Current autosave state. */
	state: SaveState;
	/** Time of the last successful save — Date, epoch ms, or a preformatted string. */
	savedAt?: Date | number | string;
	/** Corner radius. */
	radius?: Radius;
}

export function SaveIndicator(props: SaveIndicatorProps) {
	const [local, rest] = splitProps(props, ["state", "savedAt", "radius"]);
	return (
		<SyncStatus
			state={local.state}
			lastSync={local.state === "saved" ? local.savedAt : undefined}
			lastSyncPrefix="at"
			radius={local.radius}
			{...rest}
		/>
	);
}
