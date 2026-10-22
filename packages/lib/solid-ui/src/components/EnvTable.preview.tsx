/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { EnvTable } from "./EnvTable";

export const preview = (): JSX.Element => (
	<EnvTable
		vars={[
			{ key: "APP_URL", value: "https://app.dev" },
			{ key: "DATABASE_URL", value: "postgres://db:5432/app", secret: true },
			{ key: "STRIPE_KEY", value: "sk_live_51H…", secret: true },
			{ key: "LOG_LEVEL", value: "debug" },
		]}
		class="w-96 max-w-full"
	/>
);
