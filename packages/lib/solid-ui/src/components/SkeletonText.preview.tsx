/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SkeletonText } from "./SkeletonText";

export const preview = (): JSX.Element => <SkeletonText lines={3} class="w-48" />;
