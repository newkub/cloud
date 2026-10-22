/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CumulativeChart } from "./CumulativeChart";

export const preview = (): JSX.Element => <CumulativeChart data={[4, 2, 6, 3, 8, 5, 9]} class="w-80 max-w-full" />;
