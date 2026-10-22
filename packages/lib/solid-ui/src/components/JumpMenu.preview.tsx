/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { JumpMenu } from "./JumpMenu";

export const preview = (): JSX.Element => (
	<JumpMenu
		sections={[
			{
				group: "A",
				items: [
					{ label: "Accordion", href: "#accordion" },
					{ label: "Alert", href: "#alert" },
				],
			},
			{
				group: "B",
				items: [{ label: "Badge", href: "#badge" }],
			},
		]}
	/>
);
