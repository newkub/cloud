/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { EmbedFrame } from "./EmbedFrame";

export const preview = (): JSX.Element => (
	<EmbedFrame title="StackBlitz — todo demo" src="about:blank" class="w-96 max-w-full">
		<div class="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
			bun run dev — editing src/App.tsx
		</div>
	</EmbedFrame>
);
