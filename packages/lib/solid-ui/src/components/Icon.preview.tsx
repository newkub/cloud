/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Icon } from "./Icon";

export const preview = (): JSX.Element => (
	<Icon label="star" variant="primary">
		<svg viewBox="0 0 24 24" fill="currentColor" class="h-full w-full" aria-hidden="true">
			<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" />
		</svg>
	</Icon>
);
