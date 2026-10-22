/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ControlChart } from "./ControlChart";

export const preview = (): JSX.Element => (
	<ControlChart data={[10, 11, 9, 12, 10, 14, 9, 11, 10, 22, 11]} class="w-80 max-w-full" />
);
