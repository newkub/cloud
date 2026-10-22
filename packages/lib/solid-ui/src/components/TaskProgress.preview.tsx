/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TaskProgress } from "./TaskProgress";

export const preview = (): JSX.Element => (
	<TaskProgress
		class="w-64"
		tasks={[
			{ label: "Install dependencies", progress: 100, status: "done" },
			{ label: "Build workspace", progress: 64, status: "running" },
			{ label: "Run tests", progress: 0, status: "pending" },
			{ label: "Deploy preview", progress: 38, status: "error" },
		]}
	/>
);
