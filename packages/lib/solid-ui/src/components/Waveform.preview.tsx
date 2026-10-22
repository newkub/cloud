/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Waveform } from "./Waveform";

export const preview = (): JSX.Element => (
	<Waveform
		peaks={[0.3, 0.6, 0.9, 0.5, 0.8, 0.4, 1, 0.7, 0.35, 0.65, 0.9, 0.5, 0.75, 0.45, 0.6, 0.85, 0.3, 0.55, 0.7, 0.4]}
		progress={0.4}
	/>
);
