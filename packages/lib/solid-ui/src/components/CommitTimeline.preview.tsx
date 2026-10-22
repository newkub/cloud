/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CommitTimeline } from "./CommitTimeline";

export const preview = (): JSX.Element => (
	<CommitTimeline
		commits={[
			{ sha: "a1b2c3d4", msg: "feat: session store", author: "ada", branch: "main", ts: "09:12" },
			{ sha: "e5f6a7b8", msg: "fix: token refresh", author: "grace", branch: "main", ts: "09:31" },
			{ sha: "c9d0e1f2", msg: "wip: oauth flow", author: "linus", branch: "feat/oauth", ts: "09:44" },
			{ sha: "3a4b5c6d", msg: "chore: bump deps", author: "ada", branch: "main", ts: "10:02" },
			{ sha: "7e8f9a0b", msg: "feat: pkce verifier", author: "linus", branch: "feat/oauth", ts: "10:18" },
			{ sha: "c1d2e3f4", msg: "merge: oauth flow", author: "ada", branch: "main", ts: "10:47" },
		]}
		class="w-96 max-w-full"
	/>
);
