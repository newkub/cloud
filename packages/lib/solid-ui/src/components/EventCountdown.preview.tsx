/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { EventCountdown } from "./EventCountdown";

export const preview = (): JSX.Element => (
	<EventCountdown
		event={{
			title: "Design Systems Meetup",
			date: Date.now() + 3 * 86_400_000 + 5 * 3_600_000 + 42 * 60_000,
			location: "Chiang Mai, Thailand",
		}}
	/>
);
