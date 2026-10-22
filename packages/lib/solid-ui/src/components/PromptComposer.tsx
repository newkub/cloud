/**
 * PromptComposer - AI chat input with model picker, attachment slot and send button.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface ComposerModel {
	/** Model id passed to onModelChange. */
	id: string;
	/** Display name. */
	label: string;
}

export interface PromptComposerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	/** Models in the picker. */
	models?: ComposerModel[];
	/** Active model id. */
	model?: string;
	/** Called when the model changes. */
	onModelChange?: (id: string) => void;
	/** Called with the prompt text on submit (Enter or send). */
	onSubmit?: (text: string) => void;
	/** Attach-file handler; shows the paperclip button. */
	onAttach?: () => void;
	/** Placeholder. @default "Ask anything…" */
	placeholder?: string;
	/** Disable submit. @default false */
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function PromptComposer(props: PromptComposerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"models",
		"model",
		"onModelChange",
		"onSubmit",
		"onAttach",
		"placeholder",
		"disabled",
		"radius",
	]);
	const [text, setText] = createSignal("");

	const send = () => {
		const t = text().trim();
		if (!t || local.disabled) return;
		local.onSubmit?.(t);
		setText("");
	};

	const onKey = (e: KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	};

	const className = () =>
		[
			"solidui-prompt-composer border border-input bg-card focus-within:ring-2 focus-within:ring-ring",
			radiusMap[local.radius ?? "lg"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<textarea
				class="w-full resize-none bg-transparent px-3 pt-3 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
				rows={2}
				placeholder={local.placeholder ?? "Ask anything…"}
				value={text()}
				disabled={local.disabled}
				onInput={(e) => setText(e.currentTarget.value)}
				onKeyDown={onKey}
			/>
			<div class="flex items-center gap-1 px-2 pb-2">
				<Show when={local.onAttach}>
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						aria-label="Attach file"
						onClick={local.onAttach}
					>
						<NamedIcon name="paperclip" class="h-4 w-4" />
					</button>
				</Show>
				<Show when={local.models && local.models.length > 0}>
					<select
						class="h-8 rounded-md border border-input bg-background px-2 text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						aria-label="Model"
						value={local.model}
						onChange={(e) => local.onModelChange?.(e.currentTarget.value)}
					>
						<For each={local.models}>{(m) => <option value={m.id}>{m.label}</option>}</For>
					</select>
				</Show>
				<span class="flex-1" />
				<button
					type="button"
					class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label="Send prompt"
					disabled={local.disabled || !text().trim()}
					onClick={send}
				>
					<NamedIcon name="send" class="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
