/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { NavSection } from "./NavSection";

export const preview = (): JSX.Element => (
	<NavSection label="Section">
		<div class="px-3 py-1 text-xs">Item</div>
	</NavSection>
);
