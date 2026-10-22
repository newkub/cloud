/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { BatteryMeter } from "./BatteryMeter";

export const preview = (): JSX.Element => (
	<div class="flex flex-col items-start gap-2">
		<BatteryMeter level={82} />
		<BatteryMeter level={45} />
		<BatteryMeter level={15} charging />
	</div>
);
