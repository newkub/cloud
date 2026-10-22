/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CoverageChart } from "./CoverageChart";

export const preview = (): JSX.Element => (
	<CoverageChart
		class="w-80 max-w-full"
		overall={82}
		files={[
			{ name: "src/lib/auth.ts", pct: 96 },
			{ name: "src/lib/api.ts", pct: 84 },
			{ name: "src/ui/Form.tsx", pct: 71 },
			{ name: "src/ui/Modal.tsx", pct: 58 },
		]}
	/>
);
