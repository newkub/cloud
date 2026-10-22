/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SessionCard } from "./SessionCard";

export const preview = (): JSX.Element => (
	<div class="w-96 max-w-full">
		<SessionCard
			session={{ device: "Chrome on macOS", location: "Bangkok, TH", current: true, lastActive: "Active now" }}
		/>
		<SessionCard
			session={{ device: "iPhone 15 — Safari", location: "Chiang Mai, TH", lastActive: "3h ago" }}
			onRevoke={() => {}}
		/>
	</div>
);
