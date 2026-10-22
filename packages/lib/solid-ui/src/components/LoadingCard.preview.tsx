/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { LoadingCard } from "./LoadingCard";

export const preview = (): JSX.Element => (
	<div class="flex w-72 flex-col gap-3">
		<LoadingCard avatar lines={3} />
		<LoadingCard lines={2} />
	</div>
);
