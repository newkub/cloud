/**
 * ResponseActions - copy/like/dislike/regenerate row shown under AI responses.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";

export interface ResponseActionsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Response text copied by the copy action. */
	text?: string;
	/** Called on thumbs up/down with "up" | "down". */
	onFeedback?: (vote: "up" | "down") => void;
	/** Called on regenerate. Shows the regenerate action when set. */
	onRegenerate?: () => void;
	/** Hide the copy action. @default false */
	hideCopy?: boolean;
}

export function ResponseActions(props: ResponseActionsProps) {
	const [local, rest] = splitProps(props, ["class", "text", "onFeedback", "onRegenerate", "hideCopy"]);
	const [copied, setCopied] = createSignal(false);
	const [vote, setVote] = createSignal<"up" | "down" | null>(null);

	const copy = async () => {
		if (local.text) await navigator.clipboard?.writeText(local.text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const vote_ = (v: "up" | "down") => {
		setVote(vote() === v ? null : v);
		local.onFeedback?.(v);
	};

	const btn =
		"inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

	return (
		<div
			class={`solidui-response-actions inline-flex items-center gap-0.5 ${local.class ?? ""}`}
			role="toolbar"
			{...rest}
		>
			<Show when={!local.hideCopy}>
				<button type="button" class={btn} aria-label="Copy response" onClick={copy}>
					<NamedIcon name={copied() ? "check" : "copy"} class={`h-4 w-4 ${copied() ? "text-success" : ""}`} />
				</button>
			</Show>
			<button
				type="button"
				class={`${btn} ${vote() === "up" ? "text-success" : ""}`}
				aria-label="Good response"
				aria-pressed={vote() === "up"}
				onClick={() => vote_("up")}
			>
				<NamedIcon name="thumbs-up" class="h-4 w-4" />
			</button>
			<button
				type="button"
				class={`${btn} ${vote() === "down" ? "text-destructive" : ""}`}
				aria-label="Bad response"
				aria-pressed={vote() === "down"}
				onClick={() => vote_("down")}
			>
				<NamedIcon name="thumbs-down" class="h-4 w-4" />
			</button>
			<Show when={local.onRegenerate}>
				<button type="button" class={btn} aria-label="Regenerate" onClick={local.onRegenerate}>
					<NamedIcon name="rotate-cw" class="h-4 w-4" />
				</button>
			</Show>
		</div>
	);
}
