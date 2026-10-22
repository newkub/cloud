/**
 * ChatInput — message composer with send, attachment and emoji actions.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface ChatInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit"> {
	value?: string;
	onChange?: (value: string) => void;
	/** Enter or send button. */
	onSend?: (value: string) => void;
	placeholder?: string;
	/** Paperclip button → onAttach. */
	onAttach?: () => void;
	/** Emoji button → onEmoji. */
	onEmoji?: () => void;
	/** Send requires non-empty text. @default true */
	requireText?: boolean;
	/** Shift+Enter inserts newline — Enter sends. @default true */
	enterToSend?: boolean;
	maxLength?: number;
	/** Extra buttons slot before send. */
	actions?: JSX.Element;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	disabled?: boolean;
}

const inputSize = { sm: "min-h-8 text-xs", md: "min-h-9 text-sm", lg: "min-h-10 text-base" } as const;
const iconBtn =
	"flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40";

export function ChatInput(props: ChatInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"onChange",
		"onSend",
		"placeholder",
		"onAttach",
		"onEmoji",
		"requireText",
		"enterToSend",
		"maxLength",
		"actions",
		"size",
		"radius",
		"disabled",
	]);
	const canSend = () => !local.disabled && (!(local.requireText ?? true) || Boolean(local.value?.trim()));
	const send = () => {
		if (!canSend()) return;
		local.onSend?.(local.value ?? "");
	};
	const icon = (path: string) => (
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path d={path} stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	);

	return (
		<div
			class={`solidui-chat-input flex items-end gap-1 border border-border bg-surface p-1.5 ${radiusMap[local.radius ?? "xl"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.onAttach}>
				<button
					type="button"
					aria-label="Attach file"
					disabled={local.disabled}
					class={iconBtn}
					onClick={() => local.onAttach?.()}
				>
					{icon(
						"m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.2-9.19a4 4 0 0 1 5.65 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.83l8.49-8.48",
					)}
				</button>
			</Show>
			<textarea
				rows={1}
				value={local.value ?? ""}
				disabled={local.disabled}
				maxLength={local.maxLength}
				placeholder={local.placeholder ?? "Type a message…"}
				aria-label="Message"
				class={`flex-1 resize-none border-0 bg-transparent px-1.5 py-1 text-foreground focus-visible:outline-none disabled:opacity-50 ${inputSize[local.size ?? "md"]}`}
				onInput={(e) => local.onChange?.(e.currentTarget.value)}
				onKeyDown={(e) => {
					if ((local.enterToSend ?? true) && e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						send();
					}
				}}
			/>
			{local.actions}
			<Show when={local.onEmoji}>
				<button
					type="button"
					aria-label="Emoji"
					disabled={local.disabled}
					class={iconBtn}
					onClick={() => local.onEmoji?.()}
				>
					{icon("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3-10h.01M15 11h.01M8.5 14.5a4 4 0 0 0 7 0")}
				</button>
			</Show>
			<button
				type="button"
				aria-label="Send message"
				disabled={!canSend()}
				class={`flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40`}
				onClick={send}
			>
				{icon("m22 2-7 20-4-9-9-4Z")}
			</button>
		</div>
	);
}
