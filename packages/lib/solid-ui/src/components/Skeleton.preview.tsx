/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Skeleton } from "./Skeleton";

export const preview = (): JSX.Element => <Skeleton class="h-8 w-40" />;
