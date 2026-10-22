/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { FunnelSteps } from "./FunnelSteps";

export const preview = (): JSX.Element => (
	<FunnelSteps
		class="w-80 max-w-full"
		steps={[
			{ label: "Visited", value: 12000 },
			{ label: "Signed up", value: 4200 },
			{ label: "Activated", value: 1800 },
			{ label: "Paid", value: 640 },
		]}
	/>
);
