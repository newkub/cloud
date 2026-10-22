/**
 * AddressAutocomplete - input with async address suggestions, keyboard navigation, and loading/empty states.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, createUniqueId, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface AddressSuggestion {
	id: string;
	/** Primary label, e.g. street address. */
	label: string;
	/** Secondary context, e.g. city/country. */
	place?: string;
}

export interface AddressAutocompleteProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> {
	/** Fetch suggestions for a query string. */
	fetchSuggestions: (query: string) => Promise<AddressSuggestion[]>;
	/** Controlled input value. */
	value?: string;
	/** Uncontrolled initial value. */
	defaultValue?: string;
	/** Called on every input change and on selection. */
	onChange?: (value: string) => void;
	/** Called when a suggestion is picked. */
	onSelect?: (suggestion: AddressSuggestion) => void;
	placeholder?: string;
	/** Field label rendered above the input. */
	label?: string;
	/** Loading indicator text. @default "Loading…" */
	loadingText?: string;
	/** Empty-result text. @default "No results" */
	emptyText?: string;
	disabled?: boolean;
	/** Density. @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const inputSize = { sm: "h-8 px-2 text-xs", md: "h-10 px-3 text-sm", lg: "h-12 px-4 text-base" } as const;

export function AddressAutocomplete(props: AddressAutocompleteProps) {
	const { className, rest: restProps } = useComponentClasses(props, {
		base: "solidui-address-autocomplete relative",
		unstyled: props.unstyled,
		axes: [{ prop: "radius", map: radiusMap, default: "md" }],
	});
	const [, rest] = splitProps(restProps, [
		"fetchSuggestions",
		"value",
		"defaultValue",
		"onChange",
		"onSelect",
		"placeholder",
		"label",
		"loadingText",
		"emptyText",
		"disabled",
	]);
	const uid = createUniqueId();
	const inputId = `address-input-${uid}`;
	const listId = `address-list-${uid}`;
	const [innerQuery, setInnerQuery] = createSignal(props.defaultValue ?? "");
	const query = () => props.value ?? innerQuery();
	const [suggestions, setSuggestions] = createSignal<AddressSuggestion[]>([]);
	const [open, setOpen] = createSignal(false);
	const [loading, setLoading] = createSignal(false);
	const [searched, setSearched] = createSignal(false);
	const [active, setActive] = createSignal(-1);
	let req = 0;

	const run = async (q: string) => {
		const id = ++req;
		setLoading(true);
		setSearched(true);
		setOpen(true);
		setSuggestions([]);
		try {
			const res = await props.fetchSuggestions(q);
			if (id !== req) return;
			setSuggestions(res);
			setActive(-1);
		} catch {
			if (id === req) setSuggestions([]);
		} finally {
			if (id === req) setLoading(false);
		}
	};

	const onInput = (e: Event) => {
		const v = (e.target as HTMLInputElement).value;
		setInnerQuery(v);
		props.onChange?.(v);
		if (!v.trim()) {
			req += 1;
			setOpen(false);
			setLoading(false);
			setSearched(false);
			setSuggestions([]);
			setActive(-1);
			return;
		}
		void run(v);
	};

	const choose = (s: AddressSuggestion) => {
		setInnerQuery(s.label);
		props.onChange?.(s.label);
		props.onSelect?.(s);
		setOpen(false);
		setSuggestions([]);
		setSearched(false);
		setActive(-1);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const n = suggestions().length;
		if (e.key === "ArrowDown") {
			if (n) {
				e.preventDefault();
				setActive((active() + 1) % n);
			}
		} else if (e.key === "ArrowUp") {
			if (n) {
				e.preventDefault();
				setActive(active() <= 0 ? n - 1 : active() - 1);
			}
		} else if (e.key === "Enter") {
			const s = suggestions()[active()];
			if (open() && s) {
				e.preventDefault();
				choose(s);
			}
		} else if (e.key === "Escape") {
			setOpen(false);
			setActive(-1);
		}
	};

	return (
		<div class={className()} {...rest}>
			<Show when={props.label}>
				<label for={inputId} class="mb-1 block text-xs font-medium text-muted-foreground">
					{props.label}
				</label>
			</Show>
			<input
				id={inputId}
				type="text"
				role="combobox"
				aria-expanded={open()}
				aria-controls={listId}
				aria-autocomplete="list"
				aria-activedescendant={active() >= 0 ? `${listId}-option-${active()}` : undefined}
				autocomplete="off"
				class={`w-full border border-input bg-background text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${inputSize[props.size ?? "md"]} ${radiusMap[props.radius ?? "md"]}`}
				placeholder={props.placeholder ?? "Search address…"}
				value={query()}
				disabled={props.disabled}
				onInput={onInput}
				onKeyDown={onKeyDown}
			/>
			<Show when={open() && (loading() || searched())}>
				<div class="absolute left-0 right-0 z-popover mt-1 rounded-md border border-border bg-surface shadow-lg">
					<Show when={loading()}>
						<div role="status" class="px-3 py-2 text-xs text-muted-foreground">
							{props.loadingText ?? "Loading…"}
						</div>
					</Show>
					<Show when={!loading() && suggestions().length === 0}>
						<div role="status" class="px-3 py-2 text-xs text-muted-foreground">
							{props.emptyText ?? "No results"}
						</div>
					</Show>
					<Show when={!loading() && suggestions().length > 0}>
						<div role="listbox" id={listId} aria-label="Suggestions">
							<For each={suggestions()}>
								{(s, i) => (
									// biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/useFocusableInteractive: APG combobox — keyboard nav via input's aria-activedescendant
									<div
										role="option"
										tabindex="-1"
										id={`${listId}-option-${i()}`}
										aria-selected={i() === active()}
										class={`cursor-pointer px-3 py-2 text-xs ${
											i() === active() ? "bg-accent text-accent-foreground" : "text-foreground"
										}`}
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => choose(s)}
									>
										<span class="block font-medium">{s.label}</span>
										<Show when={s.place}>
											<span class="block text-2xs text-muted-foreground">{s.place}</span>
										</Show>
									</div>
								)}
							</For>
						</div>
					</Show>
				</div>
			</Show>
		</div>
	);
}
