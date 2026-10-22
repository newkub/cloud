/**
 * TypingIndicator — animated "…" dots for chat/loading contexts.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface TypingIndicatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Optional actor name — "Ada is typing". */
	label?: string;
	/** Number of dots. @default 3 */
	dots?: 2 | 3 | 4;
	size?: "sm" | "md" | "lg";
	/** Render inside a chat-bubble pill. */
	variant?: "bare" | "bubble";
	/** Corner radius (bubble variant). */
	radius?: Radius;
}

const dotSize = { sm: "h-1 w-1", md: "h-1.5 w-1.5", lg: "h-2 w-2" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function TypingIndicator(props: TypingIndicatorProps) {
	const [local, rest] = splitProps(props, ["class", "label", "dots", "size", "variant", "radius"]);
	return (
		<div
			role="status"
			aria-label={local.label ?? "Typing"}
			class={`solidui-typing-indicator inline-flex items-center gap-2 ${
				local.variant === "bubble"
					? `border border-border bg-muted/50 px-3 py-1.5 ${radiusMap[local.radius ?? "full"]}`
					: ""
			} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.label}>
				<span class={`text-muted-foreground ${textSize[local.size ?? "md"]}`}>{local.label}</span>
			</Show>
			<span class="flex items-center gap-1" aria-hidden="true">
				<For each={Array.from({ length: local.dots ?? 3 })}>
					{(_, i) => (
						<span
							class={`motion-safe:animate-bounce rounded-full bg-muted-foreground/70 ${dotSize[local.size ?? "md"]}`}
							style={{ "animation-delay": `${i() * 160}ms`, "animation-duration": "1.2s" }}
						/>
					)}
				</For>
			</span>
		</div>
	);
}
