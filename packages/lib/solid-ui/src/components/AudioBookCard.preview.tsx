/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { AudioBookCard } from "./AudioBookCard";

export const preview = (): JSX.Element => (
	<AudioBookCard book={{ title: "The Silent Engine", author: "M. Okafor", progress: 0.62 }} />
);
