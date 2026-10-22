/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { AlbumCard } from "./AlbumCard";

export const preview = (): JSX.Element => (
	<AlbumCard album={{ title: "Field Lines", artist: "Signal Path", tracks: 11, duration: 2580 }} />
);
