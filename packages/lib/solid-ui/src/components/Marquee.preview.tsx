/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Marquee } from "./Marquee";

export const preview = (): JSX.Element => (
	<Marquee class="w-64">
		<span class="px-4 text-sm">marquee content →</span>
	</Marquee>
);
