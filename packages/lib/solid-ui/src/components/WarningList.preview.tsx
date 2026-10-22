/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { WarningList } from "./WarningList";

export const preview = (): JSX.Element => (
	<WarningList
		class="w-72"
		warnings={[
			{ message: "API rate limit above 90%", count: 3, severity: "warning" },
			{ message: "Webhook delivery failed", count: 1, severity: "error" },
			{ message: "New region available", severity: "info" },
		]}
		onDismiss={() => {}}
	/>
);
