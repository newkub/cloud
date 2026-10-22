/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { BulletChart } from "./BulletChart";

export const preview = (): JSX.Element => (
	<BulletChart value={68} target={80} max={100} label="Revenue" class="w-80 max-w-full" />
);
