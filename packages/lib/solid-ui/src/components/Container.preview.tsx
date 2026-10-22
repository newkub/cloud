/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Container } from "./Container";

export const preview = (): JSX.Element => (
	<Container class="border border-dashed border-border p-3">
		<span class="text-xs text-muted-foreground">max-width container</span>
	</Container>
);
