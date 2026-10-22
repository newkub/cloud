import { For, Show } from "solid-js";
import { ComboboxOptionRow } from "./ComboboxOptionRow";
import type { ComboboxContext } from "./use-combobox";

export function ComboboxList(props: { context: ComboboxContext }) {
	const empty = () => (
		<div class="px-2 py-3 text-xs text-muted-foreground">
			{props.context.state.local.loading
				? (props.context.state.local.loadingText ?? "Loading…")
				: props.context.state.local.emptyText}
		</div>
	);
	return (
		<Show when={props.context.state.open()}>
			<div
				class={props.context.state.listClassName()}
				id={props.context.state.listboxId}
				role="listbox"
				aria-label="Options"
				aria-busy={props.context.state.local.loading || undefined}
			>
				<Show when={!props.context.state.local.loading && props.context.state.filtered().length > 0} fallback={empty()}>
					<For each={props.context.state.filtered()}>
						{(option, index) => <ComboboxOptionRow context={props.context} option={option} index={index} />}
					</For>
				</Show>
			</div>
		</Show>
	);
}
