/**
 * ScrollShadow - fades the top/bottom edges of a scrollable region when more content exists.
 */
import { createSignal, type JSX, onCleanup, onMount, splitProps } from "solid-js";

export interface ScrollShadowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Max height in px. @default 320 */
	maxHeight?: number;
	/** Shadow size in px. @default 24 */
	shadowSize?: number;
}

export function ScrollShadow(props: ScrollShadowProps) {
	const [local, rest] = splitProps(props, ["class", "maxHeight", "shadowSize", "children"]);
	const [atTop, setAtTop] = createSignal(true);
	const [atBottom, setAtBottom] = createSignal(true);
	let el: HTMLDivElement | undefined;

	const update = () => {
		if (!el) return;
		setAtTop(el.scrollTop <= 1);
		setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
	};

	onMount(() => {
		update();
		const ro = new ResizeObserver(update);
		if (el) ro.observe(el);
		onCleanup(() => ro.disconnect());
	});

	const mask = () => {
		const s = local.shadowSize ?? 24;
		const top = atTop() ? "black 0%" : `transparent 0%, black ${s}px`;
		const bottom = atBottom() ? "black 100%" : `black calc(100% - ${s}px), transparent 100%`;
		return `linear-gradient(to bottom, ${top}, ${bottom})`;
	};

	return (
		<div
			ref={el}
			class={`solidui-scroll-shadow overflow-y-auto ${local.class ?? ""}`}
			style={{ "max-height": `${local.maxHeight ?? 320}px`, "mask-image": mask() }}
			onScroll={update}
			{...rest}
		>
			{local.children}
		</div>
	);
}
