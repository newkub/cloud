import type { MultiSelectContext } from "./use-multi-select";

export function MultiSelectTrigger(props: { context: MultiSelectContext }) {
	return (
		<button
			type="button"
			class={props.context.state.triggerClassName()}
			disabled={props.context.state.local.disabled}
			onClick={() => props.context.actions.setOpen(!props.context.state.open())}
			onKeyDown={props.context.actions.onKeyDown}
			aria-haspopup="listbox"
			aria-expanded={props.context.state.open()}
			aria-controls={props.context.state.open() ? props.context.state.listboxId : undefined}
			aria-invalid={props.context.state.local.invalid || undefined}
			aria-label="Multi-select"
		>
			{props.context.state.selected().length === 0
				? props.context.state.local.placeholder
				: `${props.context.state.selected().length} selected`}
			<span aria-hidden="true">▾</span>
		</button>
	);
}
