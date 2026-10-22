/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { TablePicker } from "./TablePicker";

export const preview = (): JSX.Element => {
	const [size, setSize] = createSignal("");
	return (
		<div class="flex flex-col items-start gap-2">
			<TablePicker max={8} onInsert={(r, c) => setSize(`${r} × ${c}`)} />
			<p class="m-0 text-xs text-muted-foreground">Inserted: {size() || "—"}</p>
		</div>
	);
};
