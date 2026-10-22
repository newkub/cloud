/**
 * ReadingTime — "N min read" indicator computed from text or word count.
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface ReadingTimeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Raw text — word count derived automatically. */
	text?: string;
	/** Or pass a word count directly. */
	words?: number;
	/** Words per minute. @default 200 */
	wpm?: number;
	/** Icon before the text. @default true */
	showIcon?: boolean;
	/** Output template — `{m}` is minutes. @default "{m} min read" */
	format?: string;
	/** Minimum minutes shown. @default 1 */
	min?: number;
	size?: "sm" | "md" | "lg";
}

const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function ReadingTime(props: ReadingTimeProps) {
	const [local, rest] = splitProps(props, ["class", "text", "words", "wpm", "showIcon", "format", "min", "size"]);
	const wordCount = () => local.words ?? (local.text ? local.text.trim().split(/\s+/).filter(Boolean).length : 0);
	const minutes = () => Math.max(local.min ?? 1, Math.ceil(wordCount() / (local.wpm ?? 200)));
	return (
		<span
			class={`solidui-reading-time inline-flex items-center gap-1 text-muted-foreground ${textSize[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.showIcon ?? true}>
				<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<circle cx="12" cy="12" r="9" />
					<path d="M12 7v5l3 3" stroke-linecap="round" />
				</svg>
			</Show>
			{(local.format ?? "{m} min read").replace("{m}", String(minutes()))}
		</span>
	);
}
