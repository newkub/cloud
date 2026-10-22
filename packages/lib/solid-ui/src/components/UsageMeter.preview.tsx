/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { UsageMeter } from "./UsageMeter";

export const preview = (): JSX.Element => (
	<div class="flex w-56 flex-col gap-4">
		<UsageMeter label="Storage" used={3.2} limit={10} unit="GB" />
		<UsageMeter label="Bandwidth" used={87} limit={100} unit="GB" warnAt={0.75} />
	</div>
);
