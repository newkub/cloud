/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CommitCard } from "./CommitCard";

export const preview = (): JSX.Element => (
	<CommitCard
		sha="a1b2c3d"
		message="Add chart components"
		author="ada"
		time="2h ago"
		additions={120}
		deletions={8}
		class="w-80 max-w-full"
	/>
);
