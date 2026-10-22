import { Show } from "solid-js";
import { Input } from "../Input";
import type { ComboboxContext } from "./use-combobox";

export function ComboboxInput(props: { context: ComboboxContext }) {
	const inputClass = () =>
		[props.context.state.local.inputClass ?? "", props.context.state.local.clearable ? "pr-8" : ""]
			.filter(Boolean)
			.join(" ");
	return (
		<>
			<Input
				value={props.context.state.displayValue()}
				variant={props.context.state.local.variant}
				size={props.context.state.local.size}
				onChange={props.context.actions.onInput}
				onKeyDown={props.context.actions.onKeyDown}
				onFocus={() => props.context.actions.setOpen(true)}
				onBlur={() => props.context.actions.setOpen(false)}
				placeholder={props.context.state.local.placeholder}
				disabled={props.context.state.local.disabled}
				class={inputClass()}
				radius={props.context.state.local.radius}
				role="combobox"
				aria-expanded={props.context.state.open()}
				aria-controls={props.context.state.open() ? props.context.state.listboxId : undefined}
				aria-autocomplete="list"
				aria-invalid={props.context.state.local.invalid || undefined}
				aria-activedescendant={
					props.context.state.open() && props.context.state.filtered()[props.context.state.active()]
						? `${props.context.state.id}-option-${props.context.state.active()}`
						: undefined
				}
			/>
			<Show
				when={
					props.context.state.local.clearable && props.context.state.selected() && !props.context.state.local.disabled
				}
			>
				<button
					type="button"
					aria-label={props.context.state.local.clearLabel ?? "Clear selection"}
					class="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					onMouseDown={(e) => e.preventDefault()}
					onClick={() => props.context.actions.clear()}
				>
					×
				</button>
			</Show>
		</>
	);
}
