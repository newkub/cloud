/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { AuditRow } from "./AuditRow";

export const preview = (): JSX.Element => (
	<div class="w-96 max-w-full">
		<AuditRow
			entry={{
				actor: { name: "Ada Lovelace" },
				action: "pushed to",
				target: "main",
				ts: "2m ago",
			}}
		/>
		<AuditRow
			entry={{
				actor: { name: "Grace Hopper" },
				action: "rotated",
				target: "production API key",
				ts: "1h ago",
				severity: "warning",
			}}
		/>
		<AuditRow
			entry={{
				actor: { name: "Alan Turing" },
				action: "deleted",
				target: "repo wrikka/legacy",
				ts: "Yesterday",
				severity: "critical",
			}}
		/>
	</div>
);
