/**
 * VariantPicker — option groups rendered as color swatches or chips with a selected ring.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";

export interface VariantOption {
	value: string;
	/** CSS color — renders the option as a swatch instead of a text chip. */
	color?: string;
	/** Option cannot be selected. @default false */
	disabled?: boolean;
}

export interface VariantGroup {
	name: string;
	options: VariantOption[];
}

export type VariantPickerValue = Record<string, string>;

export interface VariantPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Option groups, e.g. Color / Size. */
	groups: VariantGroup[];
	/** Controlled selection — maps group name to option value. */
	value?: VariantPickerValue;
	/** Initial selection for uncontrolled usage. */
	defaultValue?: VariantPickerValue;
	/** Called with the next selection map on every pick. */
	onChange?: (value: VariantPickerValue) => void;
}

export function VariantPicker(props: VariantPickerProps) {
	const [local, rest] = splitProps(props, ["class", "groups", "value", "defaultValue", "onChange"]);
	const [internal, setInternal] = createSignal<VariantPickerValue>(local.defaultValue ?? {});
	const selection = () => local.value ?? internal();

	const pick = (group: string, option: VariantOption) => {
		if (option.disabled) return;
		const next = { ...selection(), [group]: option.value };
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
	};

	return (
		<div class={`solidui-variant-picker flex flex-col gap-4 ${local.class ?? ""}`} {...rest}>
			<For each={local.groups}>
				{(group) => (
					<fieldset class="flex flex-col gap-2">
						<legend class="text-sm font-medium text-foreground">
							{group.name}
							<span class="ml-2 text-xs font-normal text-muted-foreground">
								{selection()[group.name] ?? "None selected"}
							</span>
						</legend>
						<div class="flex flex-wrap gap-2">
							<For each={group.options}>
								{(option) => {
									const selected = () => selection()[group.name] === option.value;
									return option.color ? (
										<button
											type="button"
											class={`h-8 w-8 rounded-full border border-border transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 ${
												selected() ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""
											}`}
											style={{ "background-color": option.color }}
											disabled={option.disabled}
											aria-pressed={selected()}
											aria-label={option.value}
											title={option.value}
											onClick={() => pick(group.name, option)}
										/>
									) : (
										<button
											type="button"
											class={`rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through ${
												selected()
													? "border-primary bg-primary/10 text-primary ring-1 ring-ring"
													: "border-border bg-background text-foreground hover:bg-muted"
											}`}
											disabled={option.disabled}
											aria-pressed={selected()}
											onClick={() => pick(group.name, option)}
										>
											{option.value}
										</button>
									);
								}}
							</For>
						</div>
					</fieldset>
				)}
			</For>
		</div>
	);
}
