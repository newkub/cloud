/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CtaSection } from "./CtaSection";

export const preview = (): JSX.Element => (
	<CtaSection
		title="Ship faster"
		description="Start with ready-made primitives."
		actionLabel="Get started"
		class="w-80 max-w-full"
	/>
);
