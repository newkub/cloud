/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { MetricTile } from "./MetricTile";

export const preview = (): JSX.Element => (
	<MetricTile
		label="Requests / min"
		value="1,284"
		delta={4.2}
		spark={[42, 48, 45, 61, 58, 72, 69, 84, 79, 92]}
		class="w-80 max-w-full"
	/>
);
