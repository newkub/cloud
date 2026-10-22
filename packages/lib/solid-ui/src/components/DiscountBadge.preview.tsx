/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { DiscountBadge } from "./DiscountBadge";

export const preview = (): JSX.Element => (
	<div class="flex items-center gap-4">
		<DiscountBadge pct={25} />
		<DiscountBadge pct={50} size="sm" />
		<div class="relative h-16 w-40 overflow-hidden rounded-lg border border-border bg-muted">
			<DiscountBadge pct={20} variant="ribbon" />
		</div>
	</div>
);
