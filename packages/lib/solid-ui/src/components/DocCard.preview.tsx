/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { DocCard } from "./DocCard";

export const preview = (): JSX.Element => (
	<DocCard
		class="w-80 max-w-full"
		href="/docs/theming"
		doc={{
			title: "Theming with semantic tokens",
			excerpt: "How bg-card, text-muted-foreground and friends map onto light and dark palettes.",
			updatedAt: "3d ago",
			tags: ["theming", "tokens"],
		}}
	/>
);
