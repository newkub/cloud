/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SaveIndicator } from "./SaveIndicator";

export const preview = (): JSX.Element => (
	<div class="flex flex-wrap items-center gap-2">
		<SaveIndicator state="idle" />
		<SaveIndicator state="saving" />
		<SaveIndicator state="saved" savedAt={new Date()} />
		<SaveIndicator state="error" />
	</div>
);
