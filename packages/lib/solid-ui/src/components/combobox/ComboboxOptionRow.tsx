import { Show } from "solid-js";
import type { ComboboxListOption } from "./types";
import type { ComboboxContext } from "./use-combobox";

export function ComboboxOptionRow(props: {
	context: ComboboxContext;
	option: ComboboxListOption;
	index: () => number;
}) {
	return (
		<div
			id={`${props.context.state.id}-option-${props.index()}`}
			role="option"
			aria-selected={props.context.state.selected() === props.option.value}
			aria-disabled={props.option.disabled}
			data-active={props.index() === props.context.state.active() || undefined}
			tabIndex={-1}
			class={[
				"flex w-full cursor-pointer items-center gap-2 truncate rounded-md px-2 py-1.5 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				props.index() === props.context.state.active()
					? "bg-primary text-primary-foreground"
					: "text-foreground hover:bg-muted",
				props.option.disabled ? "cursor-not-allowed opacity-50" : "",
			].join(" ")}
			onMouseDown={(e) => e.preventDefault()}
			onClick={() => props.context.actions.selectOption(props.option)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					props.context.actions.selectOption(props.option);
				}
			}}
		>
			<Show when={props.option.icon}>
				<span class="inline-flex shrink-0 items-center" aria-hidden="true">
					{props.option.icon}
				</span>
			</Show>
			<span class="min-w-0 flex-1">
				<span class="block truncate">{props.option.label}</span>
				<Show when={props.option.description}>
					<span class="block truncate text-xs opacity-70">{props.option.description}</span>
				</Show>
			</span>
		</div>
	);
}
