/**
 * Select with multiple selected options and chips
 */
import { MultiSelectClear } from "./multi-select/MultiSelectClear";
import { MultiSelectList } from "./multi-select/MultiSelectList";
import { MultiSelectTags } from "./multi-select/MultiSelectTags";
import { MultiSelectTrigger } from "./multi-select/MultiSelectTrigger";
import type { MultiSelectProps } from "./multi-select/types";
import { useMultiSelect } from "./multi-select/use-multi-select";

export type { MultiSelectOption, MultiSelectProps } from "./multi-select/types";

export function MultiSelect(props: MultiSelectProps) {
	const context = useMultiSelect(props);
	return (
		<div
			class={context.state.className()}
			data-invalid={context.state.local.invalid || undefined}
			data-disabled={context.state.local.disabled || undefined}
			data-loading={context.state.local.loading || undefined}
			{...context.state.rest}
		>
			<MultiSelectTags context={context} />
			<div class="relative">
				<MultiSelectTrigger context={context} />
				<MultiSelectClear context={context} />
			</div>
			<MultiSelectList context={context} />
		</div>
	);
}
