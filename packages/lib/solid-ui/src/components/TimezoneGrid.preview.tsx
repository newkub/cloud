/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TimezoneGrid } from "./TimezoneGrid";

export const preview = (): JSX.Element => (
	<TimezoneGrid
		zones={[
			{ label: "Bangkok", offset: 7 },
			{ label: "London", offset: 0 },
			{ label: "New York", offset: -5 },
			{ label: "Tokyo", offset: 9 },
		]}
	/>
);
