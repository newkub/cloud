/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { KeyboardMap } from "./KeyboardMap";

export const preview = (): JSX.Element => (
	<div class="flex flex-col items-start gap-4">
		<KeyboardMap keys={["W", "A", "S", "D"]} />
		<KeyboardMap keys={["Ctrl", "C"]} layout="compact" />
	</div>
);
