/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { NetStatus } from "./NetStatus";

export const preview = (): JSX.Element => (
	<div class="flex flex-wrap items-center gap-2">
		<NetStatus status="online" latency={42} />
		<NetStatus status="slow" latency={830} />
		<NetStatus status="offline" />
	</div>
);
