/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SuccessCheck } from "./SuccessCheck";

export const preview = (): JSX.Element => (
	<div class="flex items-center gap-4">
		<SuccessCheck label="Payment confirmed" />
		<SuccessCheck label="Done" size={32} />
	</div>
);
