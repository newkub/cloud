/**
 * Chat - message list with a composer input.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

export interface ChatMessage {
	id: string | number;
	author?: string;
	text: string;
	sent?: boolean;
	timestamp?: string;
}

export interface ChatProps extends JSX.HTMLAttributes<HTMLDivElement> {
	messages?: ChatMessage[];
	onSend?: (text: string) => void;
	placeholder?: string;
	sendLabel?: string;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Chat(props: ChatProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"messages",
		"onSend",
		"placeholder",
		"sendLabel",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const [draft, setDraft] = createSignal("");

	const send = () => {
		const text = draft().trim();
		if (!text) return;
		local.onSend?.(text);
		setDraft("");
	};

	const className = () =>
		[
			"flex flex-col border",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			radiusMap[local.radius ?? "lg"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-label="Messages">
				<For each={local.messages ?? []}>
					{(message) => (
						<div class={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
							<div
								class={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
									message.sent ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
								}`}
							>
								{message.author && !message.sent ? (
									<div class="mb-0.5 text-xs font-medium text-muted-foreground">{message.author}</div>
								) : null}
								<div>{message.text}</div>
							</div>
						</div>
					)}
				</For>
				{local.children}
			</div>
			<form
				class="flex items-center gap-2 border-t border-border p-3"
				onSubmit={(e) => {
					e.preventDefault();
					send();
				}}
			>
				<input
					type="text"
					value={draft()}
					onInput={(e) => setDraft(e.currentTarget.value)}
					placeholder={local.placeholder ?? "Type a message…"}
					aria-label={local.placeholder ?? "Type a message…"}
					class="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				/>
				<button
					type="submit"
					class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
					disabled={draft().trim() === ""}
				>
					{local.sendLabel ?? "Send"}
				</button>
			</form>
		</div>
	);
}
