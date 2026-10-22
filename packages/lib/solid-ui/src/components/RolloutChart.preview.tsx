/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { RolloutChart } from "./RolloutChart";

export const preview = (): JSX.Element => (
	<RolloutChart
		class="w-80 max-w-full"
		stages={[
			{ label: "canary", pct: 5 },
			{ label: "us-east", pct: 25 },
			{ label: "eu-west", pct: 60 },
			{ label: "global", pct: 100 },
		]}
	/>
);
