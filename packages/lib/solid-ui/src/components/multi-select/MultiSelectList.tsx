import { For, Show } from "solid-js";
import { MultiSelectOptionRow } from "./MultiSelectOptionRow";
import type { MultiSelectContext } from "./use-multi-select";

export function MultiSelectList(props: { context: MultiSelectContext }) {
	return (
		<Show when={props.context.state.open()}>
			<div
				class={props.context.state.listClassName()}
				id={props.context.state.listboxId}
				role="listbox"
				aria-multiselectable="true"
				aria-label="Options"
				aria-busy={props.context.state.local.loading || undefined}
			>
				<Show when={props.context.state.local.searchable}>
					<input
						type="text"
						id={props.context.state.searchId}
						class={props.context.state.searchClassName()}
						placeholder={props.context.state.local.searchPlaceholder ?? "Search…"}
						aria-label="Search options"
						onInput={props.context.actions.onSearchInput}
						onKeyDown={props.context.actions.onKeyDown}
					/>
				</Show>
				<Show
					when={!props.context.state.local.loading && props.context.state.filtered().length > 0}
					fallback={
						<div class="px-2 py-3 text-xs text-muted-foreground">
							{props.context.state.local.loading
								? (props.context.state.local.loadingText ?? "Loading…")
								: (props.context.state.local.emptyText ?? "No results found.")}
						</div>
					}
				>
					<For each={props.context.state.filtered()}>
						{(option, index) => <MultiSelectOptionRow context={props.context} option={option} index={index} />}
					</For>
				</Show>
			</div>
		</Show>
	);
}
