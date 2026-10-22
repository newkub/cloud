/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { MediaCard } from "./MediaCard";

export const preview = (): JSX.Element => (
	<MediaCard type="video" duration={243} title="Building the pipeline" subtitle="Chapter 4 · Field Lines" />
);
