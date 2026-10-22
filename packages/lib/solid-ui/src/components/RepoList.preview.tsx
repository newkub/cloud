/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { RepoList } from "./RepoList";

export const preview = (): JSX.Element => (
	<RepoList
		class="w-96 max-w-full"
		repos={[
			{
				name: "wrikka/solid-ui",
				desc: "SolidJS component library",
				lang: "TypeScript",
				stars: 2140,
				forks: 132,
				updated: "2h ago",
			},
			{ name: "wrikka/fx", desc: "Tiny effects runtime", lang: "Rust", stars: 860, forks: 41, updated: "1d ago" },
			{ name: "wrikka/site", desc: "Docs website", lang: "CSS", stars: 96, forks: 8, updated: "3d ago" },
		]}
		onSelect={() => {}}
	/>
);
