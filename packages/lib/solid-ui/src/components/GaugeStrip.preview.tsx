/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { GaugeStrip } from "./GaugeStrip";

export const preview = (): JSX.Element => (
	<GaugeStrip
		items={[
			{ label: "CPU", value: 62 },
			{ label: "Mem", value: 81 },
			{ label: "Disk", value: 45 },
			{ label: "Net", value: 30 },
		]}
	/>
);
