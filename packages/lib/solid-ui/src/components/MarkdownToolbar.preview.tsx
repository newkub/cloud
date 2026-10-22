/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { type MarkdownCommand, MarkdownToolbar } from "./MarkdownToolbar";

export const preview = (): JSX.Element => {
	const [active, setActive] = createSignal<MarkdownCommand[]>(["bold"]);
	return (
		<MarkdownToolbar
			active={active()}
			onAction={(cmd) => setActive((list) => (list.includes(cmd) ? list.filter((c) => c !== cmd) : [...list, cmd]))}
		/>
	);
};
