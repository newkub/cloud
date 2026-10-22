/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { UploadList } from "./UploadList";

export const preview = (): JSX.Element => (
	<UploadList
		class="w-72"
		files={[
			{ name: "design-tokens.json", size: 18432, progress: 100, status: "done" },
			{ name: "hero-banner.png", size: 2_418_175, progress: 62, status: "uploading" },
			{ name: "report-q3.pdf", size: 812_044, progress: 21, status: "error" },
		]}
		onCancel={() => {}}
		onRetry={() => {}}
	/>
);
