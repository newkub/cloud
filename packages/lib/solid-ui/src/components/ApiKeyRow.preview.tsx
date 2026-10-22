/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ApiKeyRow } from "./ApiKeyRow";

export const preview = (): JSX.Element => (
	<div class="w-96 max-w-full">
		<ApiKeyRow
			apiKey={{
				name: "Production deploys",
				prefix: "sk_live",
				key: "sk_live_9f2k77qlx8m2v4n6",
				createdAt: "Aug 12, 2026",
				lastUsedAt: "2h ago",
			}}
			onRevoke={() => {}}
		/>
		<ApiKeyRow apiKey={{ name: "CI read-only", prefix: "sk_test", createdAt: "Sep 3, 2026" }} onRevoke={() => {}} />
	</div>
);
