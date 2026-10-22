/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SecretInput } from "./SecretInput";

export const preview = (): JSX.Element => (
	<SecretInput defaultValue="sk_live_51H7x2Kp9QzVb4Lm" class="w-80 max-w-full" />
);
