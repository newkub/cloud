/**
 * ShowMoreList - renders the first N items of a list with a show-more/less toggle.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { Button } from "./Button";

export interface ShowMoreListProps<T> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
	/** Items to render. */
	items?: T[];
	/** Items visible while collapsed. @default 5 */
	limit?: number;
	/** Render function for each item. */
	children?: (item: T, index: number) => JSX.Element;
	/** Toggle label builder — receives remaining count. */
	moreLabel?: (remaining: number) => string;
	/** Label when expanded. @default "Show less" */
	lessLabel?: string;
}

export function ShowMoreList<T>(props: ShowMoreListProps<T>) {
	const [local, rest] = splitProps(props, ["class", "items", "limit", "children", "moreLabel", "lessLabel"]);
	const [expanded, setExpanded] = createSignal(false);

	const visible = () => (expanded() ? local.items : (local.items ?? []).slice(0, local.limit ?? 5));
	const remaining = () => Math.max(0, (local.items ?? []).length - (local.limit ?? 5));

	const className = () => ["solidui-show-more-list flex flex-col gap-1", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div class={className()} {...rest}>
			<For each={visible()}>{(item, i) => local.children?.(item, i())}</For>
			<Show when={remaining() > 0}>
				<Button variant="ghost" class="self-start h-7 px-2 text-xs" onClick={() => setExpanded((v) => !v)}>
					{expanded()
						? (local.lessLabel ?? "Show less")
						: (local.moreLabel?.(remaining()) ?? `Show ${remaining()} more`)}
				</Button>
			</Show>
		</div>
	);
}
