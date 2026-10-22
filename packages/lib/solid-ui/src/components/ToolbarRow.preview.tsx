/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ToolbarRow } from "./ToolbarRow";

export const preview = (): JSX.Element => (
	<ToolbarRow
		groups={[
			{
				items: [
					{ icon: "𝐁", label: "Bold", pressed: true },
					{ icon: "𝐼", label: "Italic" },
					{ icon: "U̲", label: "Underline" },
				],
			},
			{
				items: [
					{ icon: "⬅", label: "Align left" },
					{ icon: "↔", label: "Align center", pressed: false },
				],
			},
		]}
	/>
);
