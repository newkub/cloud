/**
 * LanguageSelect — select-like listbox with flag emoji, native name and search filter.
 */
import { createMemo, createSignal, createUniqueId, For, type JSX, Show, splitProps } from "solid-js";

export interface LanguageOption {
	/** BCP-47 code, e.g. "en-US". */
	code: string;
	/** Native display name, e.g. "English (US)". */
	name: string;
	/** Flag emoji shown before the name. */
	flag?: string;
}

export interface LanguageSelectProps
	extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onInput" | "value"> {
	/** Available locales. */
	locales?: LanguageOption[];
	/** Controlled selected locale code. */
	value?: string;
	/** Initially selected locale code for uncontrolled usage. */
	defaultValue?: string;
	/** Called with the chosen locale code. */
	onChange?: (code: string) => void;
	/** Trigger placeholder when nothing is selected. @default "Select language" */
	placeholder?: string;
	/** Search field placeholder. @default "Search languages…" */
	searchPlaceholder?: string;
}

export function LanguageSelect(props: LanguageSelectProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"locales",
		"value",
		"defaultValue",
		"onChange",
		"placeholder",
		"searchPlaceholder",
	]);
	const id = `solidui-language-select-${createUniqueId()}`;
	const [open, setOpen] = createSignal(false);
	const [query, setQuery] = createSignal("");
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const selected = () => (local.value !== undefined ? local.value : internal());
	const selectedLocale = () => (local.locales ?? []).find((l) => l.code === selected());

	const filtered = createMemo(() => {
		const q = query().trim().toLowerCase();
		if (!q) return local.locales ?? [];
		return (local.locales ?? []).filter((l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q));
	});

	const choose = (code: string) => {
		if (local.value === undefined) setInternal(code);
		local.onChange?.(code);
		setOpen(false);
		setQuery("");
	};

	return (
		<div class={`solidui-language-select relative ${local.class ?? ""}`} {...rest}>
			<button
				id={`${id}-trigger`}
				type="button"
				class="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onClick={() => setOpen((v) => !v)}
				aria-haspopup="listbox"
				aria-expanded={open()}
			>
				<Show
					when={selectedLocale()}
					fallback={<span class="text-muted-foreground">{local.placeholder ?? "Select language"}</span>}
				>
					{(locale) => (
						<span class="flex items-center gap-2">
							<Show when={locale().flag}>
								<span aria-hidden="true">{locale().flag}</span>
							</Show>
							{locale().name}
						</span>
					)}
				</Show>
				<svg
					class={`h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>
			<Show when={open()}>
				<div class="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-border bg-card p-1 shadow-lg">
					<input
						type="text"
						class="mb-1 h-8 w-full rounded-sm border border-input bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						placeholder={local.searchPlaceholder ?? "Search languages…"}
						value={query()}
						onInput={(e) => setQuery(e.currentTarget.value)}
						aria-label="Filter languages"
					/>
					<div class="max-h-48 overflow-y-auto" role="listbox" aria-labelledby={`${id}-trigger`}>
						<For each={filtered()} fallback={<div class="px-2 py-1.5 text-sm text-muted-foreground">No matches</div>}>
							{(locale) => (
								<div
									role="option"
									aria-selected={selected() === locale.code}
									class={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-muted ${
										selected() === locale.code ? "bg-primary/10 font-medium text-primary" : "text-foreground"
									}`}
									onClick={() => choose(locale.code)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") choose(locale.code);
									}}
									tabIndex={0}
								>
									<Show when={locale.flag}>
										<span aria-hidden="true">{locale.flag}</span>
									</Show>
									<span class="flex-1">{locale.name}</span>
									<span class="text-2xs text-muted-foreground">{locale.code}</span>
								</div>
							)}
						</For>
					</div>
				</div>
			</Show>
		</div>
	);
}
