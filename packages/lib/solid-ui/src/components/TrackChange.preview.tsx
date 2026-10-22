/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TrackChange } from "./TrackChange";

export const preview = (): JSX.Element => (
	<p class="m-0 max-w-xs text-sm text-foreground">
		The quick brown <TrackChange type="delete">fox</TrackChange> <TrackChange type="insert">dog</TrackChange> jumps over
		the lazy dog.
	</p>
);
