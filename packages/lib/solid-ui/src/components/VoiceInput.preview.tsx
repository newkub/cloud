/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { VoiceInput } from "./VoiceInput";

export const preview = (): JSX.Element => (
	<VoiceInput lang="en-US" onTranscript={(text) => window.alert(text)} class="w-80 max-w-full" />
);
