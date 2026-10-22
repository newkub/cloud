/**
 * IconPicker - grid of icon choices with search filter and single selection.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { Input } from "./Input";

export interface IconPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Icon names available for picking. */
	icons: string[];
	/** Selected icon name. */
	value?: string;
	/** Called with the picked icon name. */
	onSelect?: (name: string) => void;
	/** Placeholder for the filter field. @default "Filter icons…" */
	placeholder?: string;
}

export function IconPicker(props: IconPickerProps) {
	const [local, rest] = splitProps(props, ["class", "icons", "value", "onSelect", "placeholder"]);
	const [query, setQuery] = createSignal("");

	const filtered = () => {
		const q = query().toLowerCase();
		return q ? local.icons.filter((n) => n.toLowerCase().includes(q)) : local.icons;
	};

	const className = () => ["solidui-icon-picker flex flex-col gap-2", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div class={className()} {...rest}>
			<Input
				type="search"
				placeholder={local.placeholder ?? "Filter icons…"}
				value={query()}
				onInput={(e) => setQuery(e.currentTarget.value)}
			/>
			<div class="grid grid-cols-6 gap-1" role="listbox" aria-label="Icons">
				<For each={filtered()}>
					{(name) => (
						<div
							role="option"
							tabIndex={0}
							aria-selected={local.value === name}
							title={name}
							class={`h-9 flex items-center justify-center rounded-md border cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
								local.value === name
									? "bg-primary text-primary-foreground border-primary"
									: "bg-background border-input hover:bg-accent"
							}`}
							onClick={() => local.onSelect?.(name)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									local.onSelect?.(name);
								}
							}}
						>
							<NamedIcon name={name} class="h-4 w-4" />
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
