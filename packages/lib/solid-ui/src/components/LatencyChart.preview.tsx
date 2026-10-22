/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { LatencyChart } from "./LatencyChart";

export const preview = (): JSX.Element => (
	<LatencyChart
		class="w-80 max-w-full"
		series={[
			{ label: "p50", values: [42, 45, 44, 47, 46, 48, 45] },
			{ label: "p95", values: [110, 118, 105, 124, 130, 122, 115] },
			{ label: "p99", values: [180, 210, 195, 240, 260, 225, 205] },
		]}
	/>
);
