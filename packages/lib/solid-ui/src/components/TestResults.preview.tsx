/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TestResults } from "./TestResults";

export const preview = (): JSX.Element => (
	<TestResults passed={148} failed={2} skipped={4} duration={12.4} class="w-80 max-w-full" />
);
