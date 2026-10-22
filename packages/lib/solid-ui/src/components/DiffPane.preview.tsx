/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { DiffPane } from "./DiffPane";

export const preview = (): JSX.Element => (
	<DiffPane
		files={[
			{
				path: "src/auth/session.ts",
				added: 24,
				removed: 6,
				status: "modified",
				lines: [
					"@@ -12,6 +12,9 @@",
					"-const ttl = 300;",
					'+const ttl = env("SESSION_TTL", 3600);',
					"+const refresh = throttle(doRefresh, 1000);",
				],
			},
			{ path: "src/auth/tokens.ts", added: 87, removed: 0, status: "added" },
			{ path: "src/legacy/login.ts", added: 0, removed: 140, status: "deleted" },
			{ path: "src/utils/time.ts", added: 4, removed: 2, status: "renamed" },
		]}
		class="w-96 max-w-full"
	/>
);
