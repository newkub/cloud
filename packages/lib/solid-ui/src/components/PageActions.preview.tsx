/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { PageActions } from "./PageActions";

export const preview = (): JSX.Element => (
	<PageActions source="src/Button.tsx" title="Button" class="w-80 max-w-full" />
);
