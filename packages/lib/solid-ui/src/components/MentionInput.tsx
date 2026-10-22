/**
 * MentionInput — textarea with @mention autocomplete and keyboard navigation.
 */
import { createSignal, createUniqueId, For, type JSX, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface MentionOption {
	/** Value inserted after the trigger */
	value: string;
	/** Label shown in the suggestion row */
	label: string;
	/** Secondary text (handle, email…) */
	hint?: string;
	/** Disable this suggestion. */
	disabled?: boolean;
}

export interface MentionInputProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
	/** Suggestion pool filtered by the text after the trigger */
	options: MentionOption[];
	/** Trigger character @default "@" */
	trigger?: string;
	/** Called with the updated value */
	onValueChange?: (value: string) => void;
	/** Called when a suggestion is chosen */
	onMention?: (option: MentionOption) => void;
	/**
	 * Called with the raw query after the trigger — use it to load `options`
	 * asynchronously (pair with `loading` for a pending state).
	 */
	onSearch?: (query: string) => void;
	/** Show a pending row in the dropdown. @default false */
	loading?: boolean;
	/** Loading row text @default "Loading…" */
	loadingText?: string;
	/** Max suggestions shown @default 8 */
	maxSuggestions?: number;
	/** Empty-state text @default "No matches" */
	emptyText?: string;
	/** Error message or invalid flag — string renders a message under the input. */
	error?: boolean | string;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
}

const sizeCls = {
	sm: "px-2.5 py-1.5 text-xs",
	md: "px-3 py-2 text-sm",
	lg: "px-3.5 py-2.5 text-base",
} as const;

export function MentionInput(props: MentionInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"options",
		"trigger",
		"value",
		"onValueChange",
		"onInput",
		"onMention",
		"onSearch",
		"loading",
		"loadingText",
		"onKeyDown",
		"maxSuggestions",
		"emptyText",
		"error",
		"variant",
		"size",
		"placeholder",
		"radius",
		"disabled",
		"readOnly",
	]);
	const [value, setValue] = createSignal(String(local.value ?? ""));
	const [open, setOpen] = createSignal(false);
	const [active, setActive] = createSignal(0);
	const [query, setQuery] = createSignal("");
	const [triggerAt, setTriggerAt] = createSignal(-1);
	const listboxId = createUniqueId();

	const trigger = () => local.trigger ?? "@";
	const filtered = () => {
		const q = query().toLowerCase();
		const list = (local.options ?? []).filter(
			(o) => o.value.toLowerCase().includes(q) || o.label.toLowerCase().includes(q),
		);
		return list.slice(0, local.maxSuggestions ?? 8);
	};
	const errorMsg = () => (typeof local.error === "string" ? local.error : undefined);

	const handleInput = (e: InputEvent & { currentTarget: HTMLTextAreaElement }) => {
		const el = e.currentTarget;
		const v = el.value;
		setValue(v);
		local.onValueChange?.(v);
		(local.onInput as ((ev: typeof e) => void) | undefined)?.(e);

		// Find the trigger word ending at the caret.
		const caret = el.selectionStart ?? v.length;
		const before = v.slice(0, caret);
		const t = trigger();
		const idx = before.lastIndexOf(t);
		const wordStart = idx + t.length;
		const hasSpace = /\s/.test(before.charAt(idx - 1) || " ");
		if (idx >= 0 && hasSpace && !/\s/.test(before.slice(wordStart))) {
			setTriggerAt(idx);
			setQuery(before.slice(wordStart));
			setOpen(true);
			setActive(0);
			local.onSearch?.(before.slice(wordStart));
		} else {
			setOpen(false);
		}
	};

	const pick = (opt: MentionOption, el?: HTMLTextAreaElement) => {
		if (opt.disabled) return;
		const caret = el?.selectionStart ?? value().length;
		const next = `${value().slice(0, triggerAt())}${trigger()}${opt.value} ${value().slice(caret)}`;
		setValue(next);
		if (el) {
			el.value = next;
			const pos = triggerAt() + trigger().length + opt.value.length + 1;
			el.setSelectionRange(pos, pos);
		}
		setOpen(false);
		local.onMention?.(opt);
		local.onValueChange?.(next);
	};

	const handleKey = (e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) => {
		if (open()) {
			const list = filtered();
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setActive((a) => (a + 1) % Math.max(list.length, 1));
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setActive((a) => (a - 1 + Math.max(list.length, 1)) % Math.max(list.length, 1));
				return;
			}
			if (e.key === "Enter" || e.key === "Tab") {
				const opt = list[active()];
				if (opt && !opt.disabled) {
					e.preventDefault();
					pick(opt, e.currentTarget);
					return;
				}
			}
			if (e.key === "Escape") {
				setOpen(false);
				return;
			}
		}
		(local.onKeyDown as ((ev: typeof e) => void) | undefined)?.(e);
	};

	return (
		<div class="solidui-mention-input relative">
			<textarea
				class={`w-full border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
					inputVariants[local.variant ?? "default"]
				} ${sizeCls[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.error ? "border-destructive" : ""} ${local.class ?? ""}`.trim()}
				rows={3}
				placeholder={local.placeholder ?? `Type ${trigger()} to mention…`}
				value={value()}
				disabled={local.disabled}
				readOnly={local.readOnly}
				aria-invalid={local.error ? true : undefined}
				onInput={handleInput}
				onKeyDown={handleKey}
				onBlur={() => setTimeout(() => setOpen(false), 150)}
				aria-expanded={open()}
				role="combobox"
				aria-autocomplete="list"
				aria-controls={listboxId}
				aria-activedescendant={open() && filtered().length ? `${listboxId}-${active()}` : undefined}
				{...rest}
			/>
			<Show when={errorMsg()}>
				<div class="mt-1 text-xs text-destructive" role="alert">
					{errorMsg()}
				</div>
			</Show>
			<Show when={open()}>
				<div
					id={listboxId}
					class="absolute z-popover mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] motion-reduce:animate-none"
					role="listbox"
				>
					<Show when={local.loading}>
						<div class="px-2 py-1.5 text-xs text-muted-foreground" role="status">
							{local.loadingText ?? "Loading…"}
						</div>
					</Show>
					<For
						each={filtered()}
						fallback={
							<Show when={!local.loading}>
								<div class="px-2 py-1.5 text-xs text-muted-foreground">{local.emptyText ?? "No matches"}</div>
							</Show>
						}
					>
						{(opt, i) => (
							<div
								id={`${listboxId}-${i()}`}
								class={`flex items-center justify-between gap-2 px-2 py-1.5 text-sm ${
									opt.disabled
										? "cursor-not-allowed opacity-50"
										: `cursor-pointer ${i() === active() ? "bg-muted text-foreground" : "text-foreground"}`
								} ${radiusMap[local.radius ?? "sm"]}`}
								role="option"
								tabIndex={-1}
								aria-selected={i() === active()}
								aria-disabled={opt.disabled || undefined}
								onMouseDown={(e) => {
									e.preventDefault();
									pick(opt);
								}}
								onMouseEnter={() => setActive(i())}
							>
								<span class="min-w-0 truncate font-medium">{opt.label}</span>
								<Show when={opt.hint}>
									<span class="shrink-0 truncate text-xs text-muted-foreground">{opt.hint}</span>
								</Show>
							</div>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
