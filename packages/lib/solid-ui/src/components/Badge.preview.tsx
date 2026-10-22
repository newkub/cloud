/**
 * Co-located preview — `export const preview` is a function returning the
 * example JSX. Picked up automatically by renderPreview (site cards, docs
 * canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Badge } from "./Badge";

export const preview = (): JSX.Element => (
	<div class="flex items-center gap-2">
		<Badge variant="primary">New</Badge>
		<Badge variant="secondary">Beta</Badge>
		<Badge variant="destructive">3</Badge>
	</div>
);
