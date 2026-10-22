/**
 * OverflowList - renders items inline and collapses the rest behind a "+N more" chip.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { Chip } from "./Chip";

export interface OverflowListProps<T> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
	/** Items to render. */
	items?: T[];
	/** Max items shown before collapsing. @default 3 */
	max?: number;
	/** Render function for each visible item. Defaults to rendering the item as text. */
	children?: (item: T, index: number) => JSX.Element;
	/** Label for the overflow chip — receives hidden count. */
	overflowLabel?: (count: number) => string;
	/** Called when the overflow chip is clicked (e.g. open a popover). */
	onOverflowClick?: (hidden: T[]) => void;
}

export function OverflowList<T>(props: OverflowListProps<T>) {
	const [local, rest] = splitProps(props, ["class", "items", "max", "children", "overflowLabel", "onOverflowClick"]);
	const [expanded, setExpanded] = createSignal(false);

	const items = () => local.items ?? [];
	const visible = () => (expanded() ? items() : items().slice(0, local.max ?? 3));
	const hidden = () => items().slice(local.max ?? 3);

	const className = () =>
		["solidui-overflow-list flex flex-wrap items-center gap-1.5", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div class={className()} {...rest}>
			<For each={visible()}>
				{(item, i) => (local.children ? local.children(item, i()) : <Chip>{String(item)}</Chip>)}
			</For>
			<Show when={hidden().length > 0}>
				<Chip
					class="cursor-pointer"
					onClick={() => (local.onOverflowClick ? local.onOverflowClick(hidden()) : setExpanded(true))}
				>
					{local.overflowLabel?.(hidden().length) ?? `+${hidden().length} more`}
				</Chip>
			</Show>
		</div>
	);
}
