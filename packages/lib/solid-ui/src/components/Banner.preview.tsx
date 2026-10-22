/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Banner } from "./Banner";

export const preview = (): JSX.Element => <Banner class="static w-64">v2.0 is live — read the changelog</Banner>;
