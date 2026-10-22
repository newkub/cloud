/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SimpleGrid } from "./SimpleGrid";

export const preview = (): JSX.Element => (
	<SimpleGrid columns={3} class="w-56 gap-1">
		<div class="h-6 rounded bg-primary/20" />
		<div class="h-6 rounded bg-secondary/20" />
		<div class="h-6 rounded bg-accent/20" />
	</SimpleGrid>
);
