/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TruncatedText } from "./TruncatedText";

export const preview = (): JSX.Element => (
	<TruncatedText text="A long text that will be truncated to fit the preview" class="w-48" />
);
