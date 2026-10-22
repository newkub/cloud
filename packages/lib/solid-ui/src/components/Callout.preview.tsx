/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Callout } from "./Callout";

export const preview = (): JSX.Element => (
	<Callout title="Tip" variant="info">
		You can drag to reorder.
	</Callout>
);
