/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CountdownBadge } from "./CountdownBadge";

export const preview = (): JSX.Element => {
	const now = Date.now();
	return (
		<div class="flex items-center gap-2">
			<CountdownBadge target={now + 2 * 86_400_000 + 4 * 3_600_000} label="Launch" />
			<CountdownBadge target={now + 5 * 3_600_000 + 12 * 60_000} label="Deadline" />
			<CountdownBadge target={now - 60_000} />
		</div>
	);
};
