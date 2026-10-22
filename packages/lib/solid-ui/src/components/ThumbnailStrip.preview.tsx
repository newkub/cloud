/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ThumbnailStrip } from "./ThumbnailStrip";

export const preview = (): JSX.Element => (
	<ThumbnailStrip
		current={2}
		frames={[
			{ label: "Intro" },
			{ label: "Setup" },
			{ label: "Demo" },
			{ label: "Results" },
			{ label: "Outro" },
			{ label: "Credits" },
		]}
	/>
);
