/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CiBadge } from "./CiBadge";

export const preview = (): JSX.Element => (
	<div class="flex w-80 max-w-full flex-wrap items-center gap-2">
		<CiBadge status="passing" href="https://ci.example.com/build/128" />
		<CiBadge status="failing" label="tests" />
		<CiBadge status="pending" label="deploy" />
	</div>
);
