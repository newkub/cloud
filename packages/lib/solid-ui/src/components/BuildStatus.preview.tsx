/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { BuildStatus } from "./BuildStatus";

export const preview = (): JSX.Element => (
	<BuildStatus status="success" branch="main" commit="a1b2c3d" duration="1m 24s" class="w-80 max-w-full" />
);
