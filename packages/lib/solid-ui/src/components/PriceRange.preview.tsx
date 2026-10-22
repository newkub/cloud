/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { PriceRange } from "./PriceRange";

export const preview = (): JSX.Element => (
	<PriceRange class="w-72 max-w-full" min={0} max={500} defaultValue={[50, 320]} currency="$" />
);
