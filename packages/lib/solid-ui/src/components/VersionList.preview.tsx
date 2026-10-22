/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { VersionList } from "./VersionList";

export const preview = (): JSX.Element => {
	const [restored, setRestored] = createSignal("");
	const now = Date.now();
	return (
		<div class="flex w-80 flex-col gap-2">
			<VersionList
				currentId="v3"
				onRestore={(v) => setRestored(v.id)}
				versions={[
					{ id: "v3", author: "Ada", ts: now - 5 * 60_000, added: 12, removed: 3, message: "Tighten intro" },
					{ id: "v2", author: "Grace", ts: now - 3 * 3_600_000, added: 40, removed: 18 },
					{ id: "v1", author: "Ada", ts: now - 2 * 86_400_000, added: 120, removed: 0, message: "First draft" },
				]}
			/>
			<p class="m-0 text-xs text-muted-foreground">Restored: {restored() || "—"}</p>
		</div>
	);
};
