/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { DataCard } from "./DataCard";

export const preview = (): JSX.Element => <DataCard label="Revenue" value="$12,480" delta={12} class="w-48" />;
