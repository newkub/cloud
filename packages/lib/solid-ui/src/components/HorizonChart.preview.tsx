/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { HorizonChart } from "./HorizonChart";

export const preview = (): JSX.Element => (
	<HorizonChart data={[3, 8, 5, 12, 7, 15, 9, 18, 11, 14, 6, 10]} class="w-80 max-w-full" />
);
