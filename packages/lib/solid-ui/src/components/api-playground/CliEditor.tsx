import { useCopyToClipboard } from "@wrikka/hooks";
import { For, Show } from "solid-js";
import type { ApiSpec } from "../../lib/api-spec";
import { buildCommand } from "./commands";
import { icon } from "./icons";
import { fieldLabel, inputClass, labelClass } from "./styles";

export interface CliEditorProps {
	spec: ApiSpec;
	argValues: Record<string, string>;
	onArgChange: (name: string, value: string) => void;
}

/** CLI command preview, argument inputs and copy button for ApiPlayground. */
export function CliEditor(props: CliEditorProps) {
	const { copy, copied } = useCopyToClipboard(1500);
	const copyCommand = () => void copy(buildCommand(props.spec, props.argValues));
	return (
		<>
			<div>
				<p class={labelClass}>Command</p>
				<pre class="m-0 p-2 rounded border border-border bg-background text-xs font-mono text-foreground overflow-auto whitespace-pre-wrap">
					{buildCommand(props.spec, props.argValues)}
				</pre>
			</div>
			<Show when={props.spec.cli?.args?.length}>
				<div>
					<p class={labelClass}>Arguments</p>
					<For each={props.spec.cli?.args ?? []}>
						{(a) => (
							<label class="flex items-center gap-2 mb-1.5">
								<span class={fieldLabel}>
									{a.name}
									<Show when={a.required}>
										<span class="text-destructive">*</span>
									</Show>
								</span>
								<input
									type="text"
									value={props.argValues[a.name] ?? ""}
									onInput={(e) => props.onArgChange(a.name, e.currentTarget.value)}
									placeholder={a.example ?? ""}
									class={inputClass}
								/>
							</label>
						)}
					</For>
				</div>
			</Show>
			<button
				type="button"
				onClick={copyCommand}
				class="inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer border-none"
			>
				{copied() ? icon.check : icon.copy}
				{copied() ? "Copied!" : "Copy command"}
			</button>
		</>
	);
}
