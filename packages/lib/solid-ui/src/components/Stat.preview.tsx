/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Stat } from "./Stat";

export const preview = (): JSX.Element => <Stat label="Revenue" value="$12.4k" trend="up" trendLabel="+8%" />;
