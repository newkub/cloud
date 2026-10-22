/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import { createSignal, type JSX, Show } from "solid-js";
import { FocusMode } from "./FocusMode";

export const preview = (): JSX.Element => {
	const [active, setActive] = createSignal(false);
	return (
		<div>
			<button
				type="button"
				onClick={() => setActive(true)}
				class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
			>
				Enter focus mode
			</button>
			<FocusMode active={active()} onExit={() => setActive(false)}>
				<p class="m-0 w-64 text-sm text-foreground">
					Only this paragraph stays lit — everything else is dimmed. Press Esc to exit.
				</p>
			</FocusMode>
			<Show when={!active()}>
				<p class="m-0 mt-2 text-xs text-muted-foreground">Focus mode inactive</p>
			</Show>
		</div>
	);
};
