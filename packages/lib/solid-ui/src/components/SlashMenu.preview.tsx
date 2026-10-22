/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { SlashMenu, type SlashMenuItem } from "./SlashMenu";

const items: SlashMenuItem[] = [
	{ group: "Text", label: "Paragraph", hint: "plain" },
	{ group: "Text", label: "Heading 1", hint: "#" },
	{ group: "Text", label: "Heading 2", hint: "##" },
	{ group: "Blocks", label: "Bullet list", hint: "-" },
	{ group: "Blocks", label: "Code block", hint: "```" },
	{ group: "Blocks", label: "Quote", hint: ">" },
];

export const preview = (): JSX.Element => {
	const [picked, setPicked] = createSignal("");
	return (
		<div class="flex flex-col gap-2">
			<SlashMenu open query="" items={items} onSelect={(i) => setPicked(i.label)} onClose={() => setPicked("closed")} />
			<p class="m-0 text-xs text-muted-foreground">Selected: {picked() || "—"}</p>
		</div>
	);
};
