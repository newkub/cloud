/**
 * EmojiTextarea — textarea with an emoji picker popover, character count and maxLength.
 */
import { createSignal, createUniqueId, For, type JSX, Show, splitProps } from "solid-js";

const EMOJIS = [
	"😀",
	"😄",
	"😂",
	"🤣",
	"😊",
	"😍",
	"😎",
	"🤔",
	"👍",
	"👎",
	"🙏",
	"👏",
	"💪",
	"🎉",
	"🔥",
	"✨",
	"❤️",
	"💡",
	"✅",
	"❌",
	"⭐",
	"🚀",
	"🐛",
	"📦",
];

export interface EmojiTextareaProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onInput" | "value"> {
	/** Controlled text value. */
	value?: string;
	/** Initial text for uncontrolled usage. @default "" */
	defaultValue?: string;
	/** Called with the next text on every edit (typing or emoji insert). */
	onInput?: (value: string) => void;
	/** Hard character cap — the count turns destructive at the limit. */
	maxLength?: number;
	/** Placeholder text. @default "Write something…" */
	placeholder?: string;
	/** Textarea rows. @default 3 */
	rows?: number;
}

export function EmojiTextarea(props: EmojiTextareaProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"onInput",
		"maxLength",
		"placeholder",
		"rows",
	]);
	const id = `solidui-emoji-textarea-${createUniqueId()}`;
	const [internal, setInternal] = createSignal(local.defaultValue ?? "");
	const [open, setOpen] = createSignal(false);
	const value = () => local.value ?? internal();
	const atLimit = () => local.maxLength !== undefined && value().length >= local.maxLength;

	const commit = (next: string) => {
		if (local.maxLength !== undefined) next = next.slice(0, local.maxLength);
		if (local.value === undefined) setInternal(next);
		local.onInput?.(next);
	};

	const insertEmoji = (emoji: string) => {
		commit(value() + emoji);
		setOpen(false);
	};

	return (
		<div class={`solidui-emoji-textarea relative flex flex-col gap-1 ${local.class ?? ""}`} {...rest}>
			<div class="relative">
				<textarea
					id={id}
					class="min-h-16 w-full resize-y rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					rows={local.rows ?? 3}
					placeholder={local.placeholder ?? "Write something…"}
					maxLength={local.maxLength}
					value={value()}
					onInput={(e) => commit(e.currentTarget.value)}
				/>
				<button
					type="button"
					class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md text-base transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					onClick={() => setOpen((v) => !v)}
					aria-expanded={open()}
					aria-label="Insert emoji"
				>
					<span aria-hidden="true">😀</span>
				</button>
				<Show when={open()}>
					<div
						class="absolute right-0 top-full z-10 mt-1 grid w-56 grid-cols-8 gap-0.5 rounded-md border border-border bg-card p-2 shadow-lg"
						role="dialog"
						aria-label="Emoji picker"
					>
						<For each={EMOJIS}>
							{(emoji) => (
								<button
									type="button"
									class="flex h-6 w-6 items-center justify-center rounded text-base transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									onClick={() => insertEmoji(emoji)}
								>
									{emoji}
								</button>
							)}
						</For>
					</div>
				</Show>
			</div>
			<div class="flex justify-end">
				<span
					class={`text-2xs tabular-nums ${atLimit() ? "text-destructive" : "text-muted-foreground"}`}
					aria-live="polite"
				>
					{value().length}
					{local.maxLength !== undefined ? ` / ${local.maxLength}` : ""}
				</span>
			</div>
		</div>
	);
}
