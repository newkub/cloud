/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SnippetTile } from "./SnippetTile";

export const preview = (): JSX.Element => (
	<SnippetTile
		class="w-80 max-w-full"
		title="Debounce a signal"
		language="ts"
		code={`const [q, setQ] = createSignal("");\ncreateEffect(() => search(q())); // runs on change`}
		onCopy={() => {}}
	/>
);
