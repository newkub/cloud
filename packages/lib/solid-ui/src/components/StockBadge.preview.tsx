/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { StockBadge } from "./StockBadge";

export const preview = (): JSX.Element => (
	<div class="flex items-center gap-2">
		<StockBadge level="in" />
		<StockBadge level="low" count={3} />
		<StockBadge level="out" />
	</div>
);
