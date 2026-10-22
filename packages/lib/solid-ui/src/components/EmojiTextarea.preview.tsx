/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { EmojiTextarea } from "./EmojiTextarea";

export const preview = (): JSX.Element => (
	<EmojiTextarea class="w-72 max-w-full" defaultValue="Shipping today " maxLength={140} />
);
