/**
 * SearchBar — compact search input that expands on focus; Escape clears, with a result-count hint.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";

export interface SearchBarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onInput"> {
	/** Controlled input value. */
	value?: string;
	/** Initial value for uncontrolled usage. */
	defaultValue?: string;
	/** Called with the new value on every edit and on Escape-clear. */
	onInput?: (value: string) => void;
	/** Input placeholder. @default "Search…" */
	placeholder?: string;
	/** Result count shown as a hint under the field while it has a value. */
	resultCount?: number;
	/** Width when collapsed. @default "w-40" */
	collapsedWidth?: string;
	/** Width while focused or filled. @default "w-64" */
	expandedWidth?: string;
}

export function SearchBar(props: SearchBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"onInput",
		"placeholder",
		"resultCount",
		"collapsedWidth",
		"expandedWidth",
		"onFocus",
		"onBlur",
		"onKeyDown",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [focused, setFocused] = createSignal(false);
	const value = () => (local.value !== undefined ? local.value : internal());
	const expanded = () => focused() || value() !== "";

	const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
		setInternal(e.currentTarget.value);
		local.onInput?.(e.currentTarget.value);
	};

	const clear = () => {
		setInternal("");
		local.onInput?.("");
	};

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		if (e.key === "Escape") {
			e.preventDefault();
			clear();
		}
		if (typeof local.onKeyDown === "function") local.onKeyDown(e);
	};

	return (
		<div class={`solidui-search-bar inline-flex flex-col gap-1 ${local.class ?? ""}`.trim()} {...rest}>
			<div
				class={`relative transition-all motion-reduce:transition-none ${
					expanded() ? (local.expandedWidth ?? "w-64") : (local.collapsedWidth ?? "w-40")
				}`}
			>
				<span
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground"
					aria-hidden="true"
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="7" />
						<path d="m21 21-4.3-4.3" stroke-linecap="round" />
					</svg>
				</span>
				<input
					type="search"
					class="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-search-cancel-button]:appearance-none"
					placeholder={local.placeholder ?? "Search…"}
					value={value()}
					onInput={handleInput}
					onKeyDown={handleKeyDown}
					onFocus={(e) => {
						setFocused(true);
						if (typeof local.onFocus === "function") local.onFocus(e);
					}}
					onBlur={(e) => {
						setFocused(false);
						if (typeof local.onBlur === "function") local.onBlur(e);
					}}
				/>
			</div>
			<Show when={value() !== "" && local.resultCount !== undefined}>
				<p class="text-xs text-muted-foreground" aria-live="polite">
					{local.resultCount} {local.resultCount === 1 ? "result" : "results"}
				</p>
			</Show>
		</div>
	);
}
