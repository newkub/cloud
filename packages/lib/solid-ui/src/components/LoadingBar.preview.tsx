/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { LoadingBar } from "./LoadingBar";

export const preview = (): JSX.Element => <LoadingBar progress={60} class="w-64" />;
