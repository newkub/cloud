/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CouponInput } from "./CouponInput";

export const preview = (): JSX.Element => (
	<CouponInput
		class="w-72 max-w-full"
		placeholder="e.g. SAVE20"
		onApply={(code) => code.trim().toUpperCase() === "SAVE20"}
	/>
);
