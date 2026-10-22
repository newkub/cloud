/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SignalBars } from "./SignalBars";

export const preview = (): JSX.Element => (
	<div class="flex flex-col items-start gap-2">
		<SignalBars strength={1} />
		<SignalBars strength={3} />
		<SignalBars strength={4} animated />
	</div>
);
