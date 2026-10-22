import { For, Show } from "solid-js";
import type { ApiParameter } from "../../lib/api-spec";
import { fieldLabel, inputClass, labelClass } from "./styles";

export interface ParamsEditorProps {
	params: ApiParameter[];
	values: Record<string, string>;
	onChange: (name: string, value: string) => void;
}

/** REST parameter inputs for ApiPlayground. */
export function ParamsEditor(props: ParamsEditorProps) {
	return (
		<div>
			<p class={labelClass}>Parameters</p>
			<For each={props.params}>
				{(p) => (
					<label class="flex items-center gap-2 mb-1.5">
						<span class={fieldLabel}>
							{p.name}
							<Show when={p.required}>
								<span class="text-destructive">*</span>
							</Show>
						</span>
						<input
							type="text"
							value={props.values[p.name] ?? ""}
							onInput={(e) => props.onChange(p.name, e.currentTarget.value)}
							placeholder={p.in}
							class={inputClass}
						/>
					</label>
				)}
			</For>
		</div>
	);
}
