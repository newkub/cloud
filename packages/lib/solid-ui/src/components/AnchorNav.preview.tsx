/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { AnchorNav } from "./AnchorNav";

export const preview = (): JSX.Element => (
	<AnchorNav
		items={[
			{ id: "intro", label: "Introduction" },
			{ id: "usage", label: "Usage" },
			{ id: "api", label: "API" },
		]}
	/>
);
