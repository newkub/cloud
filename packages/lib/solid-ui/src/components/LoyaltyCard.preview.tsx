/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { LoyaltyCard } from "./LoyaltyCard";

export const preview = (): JSX.Element => (
	<div class="flex flex-wrap gap-3">
		<LoyaltyCard points={1240} stamps={{ earned: 6, required: 8 }} tier="Gold" />
		<LoyaltyCard points={320} stamps={{ earned: 8, required: 8 }} tier="Silver" />
	</div>
);
