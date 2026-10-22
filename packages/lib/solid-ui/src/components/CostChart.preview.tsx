/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CostChart } from "./CostChart";

export const preview = (): JSX.Element => (
	<CostChart
		class="w-80 max-w-full"
		months={[
			{
				label: "Jun",
				segments: [
					{ name: "compute", value: 420 },
					{ name: "storage", value: 180 },
					{ name: "egress", value: 90 },
				],
			},
			{
				label: "Jul",
				segments: [
					{ name: "compute", value: 460 },
					{ name: "storage", value: 195 },
					{ name: "egress", value: 110 },
				],
			},
			{
				label: "Aug",
				segments: [
					{ name: "compute", value: 510 },
					{ name: "storage", value: 210 },
					{ name: "egress", value: 140 },
				],
			},
		]}
	/>
);
