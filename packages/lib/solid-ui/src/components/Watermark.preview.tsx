/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Watermark } from "./Watermark";

export const preview = (): JSX.Element => (
	<Watermark text="DRAFT">
		<div class="h-16 w-56 rounded border border-border" />
	</Watermark>
);
