/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ReviewCard } from "./ReviewCard";

export const preview = (): JSX.Element => (
	<ReviewCard
		onVote={() => {}}
		review={{
			author: "Ada Lovelace",
			rating: 4.5,
			ts: "Sep 10, 2026",
			title: "Sturdy and looks great",
			body: "The canvas is thick, stitching is clean, and it fits a 15-inch laptop plus groceries. Wish it had a zipper pocket inside.",
			helpful: 24,
			unhelpful: 2,
			verified: true,
		}}
	/>
);
