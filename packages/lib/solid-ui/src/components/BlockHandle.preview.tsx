/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { BlockHandle, type BlockHandleAction } from "./BlockHandle";

export const preview = (): JSX.Element => {
	const [last, setLast] = createSignal<BlockHandleAction | "">("");
	return (
		<div class="flex items-center gap-2">
			<BlockHandle onAction={setLast} />
			<span class="text-xs text-muted-foreground">Last action: {last() || "—"}</span>
		</div>
	);
};
