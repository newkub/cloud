/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ChartCard } from "./ChartCard";

export const preview = (): JSX.Element => <ChartCard title="Weekly signups" value="1,248" delta={8} class="w-64" />;
