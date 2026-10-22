/**
 * ChatBubble — chat message bubble with avatar, time and delivery status.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface ChatBubbleProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Message body. */
	children?: JSX.Element;
	/** Which side the bubble sits. @default "left" */
	side?: "left" | "right";
	author?: string;
	avatar?: string;
	/** Time text. */
	time?: string;
	status?: MessageStatus;
	/** Bubble color. */
	variant?: "default" | "primary";
	size?: "sm" | "md" | "lg";
	/** Corner radius on the bubble. */
	radius?: Radius;
	/** Show avatar. @default true when avatar provided */
	showAvatar?: boolean;
}

const bubblePad = { sm: "px-2.5 py-1.5 text-2xs", md: "px-3 py-2 text-sm", lg: "px-4 py-2.5 text-base" } as const;
const statusIcon: Record<MessageStatus, string> = {
	sending: "M12 8v4m0 4h.01",
	sent: "m5 13 4 4L19 7",
	delivered: "m3 13 3 3 9-9m-1 6 3 3 8-9",
	read: "m3 13 3 3 9-9m-1 6 3 3 8-9",
	failed: "M12 9v4m0 4h.01",
};

export function ChatBubble(props: ChatBubbleProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"side",
		"author",
		"avatar",
		"time",
		"status",
		"variant",
		"size",
		"radius",
		"showAvatar",
	]);
	const right = () => local.side === "right";
	return (
		<div
			class={`solidui-chat-bubble flex items-end gap-2 ${right() ? "flex-row-reverse" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={(local.showAvatar ?? true) && (local.avatar || !right())}>
				<span class="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-2xs font-semibold text-primary">
					{local.avatar ? (
						<img src={local.avatar} alt={local.author ?? ""} class="h-full w-full object-cover" />
					) : (
						(local.author ?? "?").charAt(0).toUpperCase()
					)}
				</span>
			</Show>
			<div class={`max-w-[75%] ${right() ? "items-end" : ""}`}>
				<Show when={local.author && !right()}>
					<div class="mb-0.5 ml-1 text-2xs font-medium text-muted-foreground">{local.author}</div>
				</Show>
				<div
					class={`${bubblePad[local.size ?? "md"]} ${
						local.variant === "primary" || right()
							? "bg-primary text-primary-foreground"
							: "border border-border bg-muted/50 text-foreground"
					} ${radiusMap[local.radius ?? "xl"]} ${right() ? "rounded-br-sm" : "rounded-bl-sm"}`}
				>
					{local.children}
				</div>
				<Show when={local.time || local.status}>
					<div
						class={`mt-0.5 flex items-center gap-1 px-1 text-3xs text-muted-foreground ${right() ? "justify-end" : ""}`}
					>
						<Show when={local.time}>
							<span class="tabular-nums">{local.time}</span>
						</Show>
						<Show when={local.status && right()}>
							<svg
								class={`h-3 w-3 ${local.status === "read" ? "text-info" : local.status === "failed" ? "text-destructive" : ""}`}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<path d={statusIcon[local.status ?? "sent"]} stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</Show>
					</div>
				</Show>
			</div>
		</div>
	);
}
