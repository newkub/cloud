/**
 * Filterable input with dropdown options
 */
import { ComboboxInput } from "./combobox/ComboboxInput";
import { ComboboxList } from "./combobox/ComboboxList";
import type { ComboboxProps } from "./combobox/types";
import { useCombobox } from "./combobox/use-combobox";

export type { ComboboxOption, ComboboxProps } from "./combobox/types";

export function Combobox(props: ComboboxProps) {
	const context = useCombobox(props);
	return (
		<div
			class={context.state.className()}
			data-invalid={context.state.local.invalid || undefined}
			data-loading={context.state.local.loading || undefined}
			{...context.state.rest}
		>
			<ComboboxInput context={context} />
			<ComboboxList context={context} />
		</div>
	);
}
