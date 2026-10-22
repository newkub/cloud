/**
 * InfiniteScroll - fires onLoadMore when the sentinel near the bottom becomes visible.
 */
import { type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { Spinner } from "./Spinner";

export interface InfiniteScrollProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Called when the sentinel enters the viewport. */
	onLoadMore?: () => void;
	/** No more items — hides the sentinel and loader. @default false */
	done?: boolean;
	/** Show spinner while the next page loads. @default false */
	loading?: boolean;
	/** Root margin around the sentinel. @default "200px" */
	rootMargin?: string;
	/** Content shown when done. */
	endContent?: JSX.Element;
}

export function InfiniteScroll(props: InfiniteScrollProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"onLoadMore",
		"done",
		"loading",
		"rootMargin",
		"endContent",
		"children",
	]);
	let sentinel: HTMLDivElement | undefined;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting) && !local.done && !local.loading) {
					local.onLoadMore?.();
				}
			},
			{ rootMargin: local.rootMargin ?? "200px" },
		);
		if (sentinel) observer.observe(sentinel);
		onCleanup(() => observer.disconnect());
	});

	return (
		<div class={`solidui-infinite-scroll ${local.class ?? ""}`} {...rest}>
			{local.children}
			<Show when={!local.done}>
				<div ref={sentinel} class="flex justify-center py-4" aria-hidden="true">
					<Show when={local.loading}>
						<Spinner />
					</Show>
				</div>
			</Show>
			<Show when={local.done && local.endContent}>
				<div class="py-4 text-center text-xs text-muted-foreground">{local.endContent}</div>
			</Show>
		</div>
	);
}
