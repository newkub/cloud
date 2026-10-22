/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ChangelogCard } from "./ChangelogCard";

export const preview = (): JSX.Element => (
	<ChangelogCard
		class="w-80 max-w-full"
		release={{
			version: "2.4.0",
			date: "Sep 14, 2026",
			changes: {
				added: ["UserCard, RepoList and InvoiceCard components", "Preview glob for stories"],
				fixed: ["Avatar fallback flash on slow networks"],
				breaking: ['Dropped `size="xl"` from Badge'],
			},
		}}
		compareHref="https://github.com/wrikka/solid-ui/compare/v2.3.0...v2.4.0"
	/>
);
