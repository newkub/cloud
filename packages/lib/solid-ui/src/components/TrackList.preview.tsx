/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TrackList } from "./TrackList";

export const preview = (): JSX.Element => (
	<TrackList
		current={1}
		tracks={[
			{ title: "Signal Path", artist: "Field Lines", duration: 214 },
			{ title: "Low Orbit", artist: "Field Lines", duration: 187 },
			{ title: "Grain Silo", artist: "Field Lines", duration: 243 },
		]}
	/>
);
