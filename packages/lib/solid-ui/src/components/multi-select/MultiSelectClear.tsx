import { Show } from "solid-js";
import type { MultiSelectContext } from "./use-multi-select";

export function MultiSelectClear(props: { context: MultiSelectContext }) {
	return (
		<Show
			when={
				props.context.state.local.clearable &&
				props.context.state.selected().length > 0 &&
				!props.context.state.local.disabled
			}
		>
			<button
				type="button"
				aria-label={props.context.state.local.clearLabel ?? "Clear selection"}
				class="absolute right-8 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onClick={() => props.context.actions.clear()}
			>
				×
			</button>
		</Show>
	);
}
