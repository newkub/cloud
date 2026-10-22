/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { QuotaBar } from "./QuotaBar";

export const preview = (): JSX.Element => (
	<QuotaBar used={7.2} total={10} label="Storage" showValues class="w-80 max-w-full" />
);
