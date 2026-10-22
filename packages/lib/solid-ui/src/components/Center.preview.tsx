/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Center } from "./Center";

export const preview = (): JSX.Element => (
	<Center class="h-16 w-48 rounded-md border border-dashed border-border">centered</Center>
);
