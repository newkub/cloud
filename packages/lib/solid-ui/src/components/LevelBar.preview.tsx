/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { LevelBar } from "./LevelBar";

export const preview = (): JSX.Element => (
	<LevelBar value={68} ticks={[25, 50, 75]} label="Level" showValue class="w-80 max-w-full" />
);
