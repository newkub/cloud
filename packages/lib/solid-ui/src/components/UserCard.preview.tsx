/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { UserCard } from "./UserCard";

export const preview = (): JSX.Element => (
	<UserCard
		class="w-80 max-w-full"
		user={{
			name: "Ada Lovelace",
			handle: "@ada",
			role: "Maintainer",
			stats: { posts: 128, followers: 4210, following: 310 },
		}}
		onMessage={() => {}}
	/>
);
