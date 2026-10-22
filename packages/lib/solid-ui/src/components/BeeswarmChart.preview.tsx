/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { BeeswarmChart } from "./BeeswarmChart";

export const preview = (): JSX.Element => (
	<BeeswarmChart data={[2, 3, 3, 4, 5, 5, 5, 6, 7, 8, 9, 9, 10, 12]} class="w-80 max-w-full" />
);
