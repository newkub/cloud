/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { VideoTimeline } from "./VideoTimeline";

export const preview = (): JSX.Element => (
	<VideoTimeline
		duration={372}
		current={140}
		buffered={250}
		chapters={[
			{ time: 0, label: "Intro" },
			{ time: 95, label: "Demo" },
			{ time: 240, label: "Deep dive" },
		]}
	/>
);
