/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TrendLine } from "./TrendLine";

export const preview = (): JSX.Element => (
	<TrendLine data={[120, 132, 128, 145, 160, 152, 178]} formatValue={(v) => `${v} ms`} />
);
