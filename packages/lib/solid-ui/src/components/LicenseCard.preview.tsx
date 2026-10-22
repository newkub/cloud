/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { LicenseCard } from "./LicenseCard";

export const preview = (): JSX.Element => (
	<LicenseCard
		class="w-80 max-w-full"
		license={{
			type: "Pro",
			key: "WRKA-9F2K-77QL-X8M2",
			seats: 10,
			used: 7,
			expiresAt: "Dec 31, 2026",
		}}
		renewHref="/billing/renew"
	/>
);
