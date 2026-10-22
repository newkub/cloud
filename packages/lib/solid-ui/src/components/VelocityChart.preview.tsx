/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { VelocityChart } from "./VelocityChart";

export const preview = (): JSX.Element => (
	<VelocityChart
		class="w-80 max-w-full"
		sprints={[
			{ label: "S1", committed: 40, completed: 32 },
			{ label: "S2", committed: 42, completed: 38 },
			{ label: "S3", committed: 38, completed: 36 },
			{ label: "S4", committed: 45, completed: 44 },
			{ label: "S5", committed: 44, completed: 41 },
		]}
	/>
);
