/**
 * CommentPin — anchored comment bubble: avatar, author, relative time and
 * body text with resolve/reply actions.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CommentData {
	author: string;
	body: string;
	/** Timestamp — epoch ms, ISO string or Date. */
	ts: number | string | Date;
	/** Avatar image — falls back to the author's initial. */
	avatar?: string;
}

const timeAgo = (ts: number | string | Date): string => {
	const t = new Date(ts).getTime();
	if (Number.isNaN(t)) return "";
	const s = Math.max(0, (Date.now() - t) / 1000);
	if (s < 60) return "just now";
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 30) return `${d}d ago`;
	return new Date(t).toLocaleDateString();
};

export interface CommentPinProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** The comment to display. */
	comment?: CommentData;
	/** Called when Resolve is clicked. */
	onResolve?: () => void;
	/** Called when Reply is clicked. */
	onReply?: () => void;
	/** Render the thread as resolved (muted, no actions). @default false */
	resolved?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function CommentPin(props: CommentPinProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"comment",
		"onResolve",
		"onReply",
		"resolved",
		"radius",
		"elevation",
	]);
	const showActions = () => !local.resolved && (local.onResolve || local.onReply);

	return (
		<div
			class={`solidui-comment-pin w-64 border border-border bg-surface p-3 shadow-lg ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.resolved ? "opacity-70" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center gap-2">
				<span class="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-2xs font-semibold text-primary">
					<Show when={local.comment?.avatar} fallback={local.comment?.author.charAt(0).toUpperCase()}>
						{(src) => <img src={src()} alt="" class="h-full w-full object-cover" />}
					</Show>
				</span>
				<span class="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{local.comment?.author}</span>
				<span class="shrink-0 text-2xs text-muted-foreground">{timeAgo(local.comment?.ts ?? "")}</span>
			</div>
			<p class="m-0 mt-2 text-xs leading-relaxed text-foreground">{local.comment?.body}</p>
			<Show when={showActions()}>
				<div class="mt-2 flex items-center gap-1">
					<Show when={local.onReply}>
						<button
							type="button"
							onClick={() => local.onReply?.()}
							class="rounded px-2 py-1 text-2xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							Reply
						</button>
					</Show>
					<Show when={local.onResolve}>
						<button
							type="button"
							onClick={() => local.onResolve?.()}
							class="rounded px-2 py-1 text-2xs font-medium text-success transition-colors hover:bg-success/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							Resolve
						</button>
					</Show>
				</div>
			</Show>
		</div>
	);
}
