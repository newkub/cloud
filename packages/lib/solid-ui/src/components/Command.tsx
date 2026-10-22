/**
 * Command - filterable command list with keyboard selection.
 */
import { createSignal, createUniqueId, For, mergeProps, Show } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { Input } from "./Input";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-sm",
};

export interface CommandItem {
	value: string;
	label: string;
	shortcut?: string;
	onSelect?: () => void;
}

export interface CommandProps {
	items?: CommandItem[];
	placeholder?: string;
	emptyText?: string;
	onSelect?: (item: CommandItem) => void;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const DEFAULT_COMMAND_PROPS = {
	items: [] as CommandItem[],
	placeholder: "Search…",
	emptyText: "No results found.",
};

function useCommandState(props: CommandProps) {
	const merged = mergeProps(DEFAULT_COMMAND_PROPS, props);
	const id = createUniqueId();
	const [query, setQuery] = createSignal("");
	const [active, setActive] = createSignal(0);
	const filtered = () => merged.items.filter((item) => item.label.toLowerCase().includes(query().toLowerCase()));
	function select(item: CommandItem, index: number) {
		setActive(index);
		item.onSelect?.();
		props.onSelect?.(item);
	}
	function onKeyDown(e: KeyboardEvent) {
		const list = filtered();
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => Math.min(i + 1, list.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter" && list[active()]) {
			e.preventDefault();
			select(list[active()], active());
		}
	}
	const activeId = () => (filtered()[active()] ? `command-${id}-option-${active()}` : undefined);
	return { merged, id, query, setQuery, active, setActive, filtered, select, onKeyDown, activeId };
}

type CommandContext = ReturnType<typeof useCommandState>;

function CommandInput(props: { context: CommandContext }) {
	return (
		<Input
			type="text"
			value={props.context.query()}
			onInput={(e) => {
				props.context.setQuery(e.currentTarget.value);
				props.context.setActive(0);
			}}
			onKeyDown={props.context.onKeyDown}
			placeholder={props.context.merged.placeholder}
			class="h-9 border-0 bg-transparent px-2 focus-visible:ring-0"
			role="combobox"
			aria-autocomplete="list"
			aria-label="Command search"
			aria-expanded={props.context.filtered().length > 0}
			aria-controls={`command-${props.context.id}-listbox`}
			aria-activedescendant={props.context.activeId()}
		/>
	);
}

function CommandList(props: { context: CommandContext }) {
	return (
		<div id={`command-${props.context.id}-listbox`} class="mt-1 max-h-64 overflow-y-auto" role="listbox">
			<Show
				when={props.context.filtered().length > 0}
				fallback={<p class="px-2 py-3 text-xs text-muted-foreground">{props.context.merged.emptyText}</p>}
			>
				<For each={props.context.filtered()}>
					{(item, index) => (
						<button
							type="button"
							id={`command-${props.context.id}-option-${index()}`}
							role="option"
							aria-selected={index() === props.context.active()}
							onClick={() => props.context.select(item, index())}
							class={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
								index() === props.context.active()
									? "bg-primary text-primary-foreground"
									: "text-foreground hover:bg-muted"
							}`}
						>
							<span class="min-w-0 truncate">{item.label}</span>
							<Show when={item.shortcut}>
								<kbd class="shrink-0 rounded border border-border px-1.5 py-0.5 text-xs opacity-80">
									{item.shortcut}
								</kbd>
							</Show>
						</button>
					)}
				</For>
			</Show>
		</div>
	);
}

export function Command(props: CommandProps) {
	const context = useCommandState(props);

	return (
		<div
			class={`w-full border ${variantMap[props.variant ?? "default"]} ${paddingSizes[props.size ?? "xs"]} ${radiusMap[props.radius ?? "xl"]} ${props.elevation ? elevationMap[props.elevation] : ""} ${props.class ?? ""}`}
		>
			<CommandInput context={context} />
			<CommandList context={context} />
		</div>
	);
}
