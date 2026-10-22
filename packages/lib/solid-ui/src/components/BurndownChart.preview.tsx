/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { BurndownChart } from "./BurndownChart";

export const preview = (): JSX.Element => (
	<BurndownChart days={10} ideal={80} actual={[80, 74, 68, 60, 55, 44, 40]} class="w-80 max-w-full" />
);
