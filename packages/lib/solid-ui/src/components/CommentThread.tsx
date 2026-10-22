/**
 * CommentThread — nested comment list with avatars, time and replies.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface Comment {
	id: string;
	author: string;
	/** Avatar image URL — falls back to author initial. */
	avatar?: string;
	/** Pre-formatted time string, e.g. "2h ago". */
	time?: string;
	content: JSX.Element;
	replies?: Comment[];
}

export interface CommentThreadProps extends JSX.HTMLAttributes<HTMLDivElement> {
	comments: Comment[];
	/** Max nesting depth rendered — deeper replies flatten. @default 4 */
	maxDepth?: number;
	onReply?: (comment: Comment) => void;
	size?: "sm" | "md" | "lg";
	/** Corner radius on avatars/body cards. */
	radius?: Radius;
}

const avatarSize = { sm: "h-6 w-6 text-2xs", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" } as const;
const bodySize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function CommentThread(props: CommentThreadProps) {
	const [local, rest] = splitProps(props, ["class", "comments", "maxDepth", "onReply", "size", "radius"]);

	const renderComment = (c: Comment, depth: number): JSX.Element => (
		<div class={depth > 0 ? "ml-4 border-l border-border/60 pl-4" : ""}>
			<div class="flex gap-3 py-2">
				<span
					class={`flex shrink-0 items-center justify-center overflow-hidden bg-muted font-semibold text-muted-foreground ${avatarSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]}`}
				>
					{c.avatar ? (
						<img src={c.avatar} alt="" class="h-full w-full object-cover" />
					) : (
						c.author.charAt(0).toUpperCase()
					)}
				</span>
				<div class="min-w-0 flex-1">
					<div class="flex items-baseline gap-2">
						<span class="text-xs font-semibold text-foreground">{c.author}</span>
						<Show when={c.time}>
							<span class="text-2xs text-muted-foreground">{c.time}</span>
						</Show>
					</div>
					<div class={`mt-0.5 text-foreground/90 ${bodySize[local.size ?? "md"]}`}>{c.content}</div>
					<Show when={local.onReply}>
						<button
							type="button"
							class="mt-1 text-2xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none"
							onClick={() => local.onReply?.(c)}
						>
							Reply
						</button>
					</Show>
				</div>
			</div>
			<Show when={depth < (local.maxDepth ?? 4)}>
				<For each={c.replies}>{(r) => renderComment(r, depth + 1)}</For>
			</Show>
			<Show when={depth >= (local.maxDepth ?? 4)}>
				<For each={c.replies}>{(r) => renderComment(r, depth)}</For>
			</Show>
		</div>
	);

	return (
		<div class={`solidui-comment-thread ${local.class ?? ""}`.trim()} {...rest}>
			<For each={local.comments}>{(c) => renderComment(c, 0)}</For>
		</div>
	);
}
