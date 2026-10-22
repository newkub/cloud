import { For } from "solid-js";
import type { MultiSelectContext } from "./use-multi-select";

export function MultiSelectTags(props: { context: MultiSelectContext }) {
	return (
		<div class="mb-1.5 flex flex-wrap items-center gap-1.5">
			<For each={props.context.state.selectedOptions()}>
				{(option) => (
					<span class="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
						{option.label}
						<button
							type="button"
							aria-label={`Remove ${option.label}`}
							class="ml-0.5 -mr-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-primary-foreground transition-colors motion-reduce:transition-none hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-foreground focus-visible:ring-offset-1 focus-visible:ring-offset-primary"
							onClick={() => props.context.actions.toggle(option.value)}
						>
							×
						</button>
					</span>
				)}
			</For>
		</div>
	);
}
