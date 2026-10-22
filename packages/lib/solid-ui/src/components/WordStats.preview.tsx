/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX } from "solid-js";
import { WordStats } from "./WordStats";

export const preview = (): JSX.Element => {
	const [text, setText] = createSignal("The quick brown fox jumps over the lazy dog. It keeps running!");
	return (
		<div class="flex w-80 flex-col gap-2">
			<textarea
				class="h-20 w-full rounded-md border border-border bg-background p-2 text-xs text-foreground"
				value={text()}
				onInput={(e) => setText(e.currentTarget.value)}
			/>
			<WordStats text={text()} />
		</div>
	);
};
