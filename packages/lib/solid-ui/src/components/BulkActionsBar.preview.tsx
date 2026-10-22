/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { BulkActionsBar } from "./BulkActionsBar";

export const preview = (): JSX.Element => (
	<BulkActionsBar count={3} actions={[{ label: "Delete", onClick: () => {} }]} class="w-80 max-w-full" />
);
