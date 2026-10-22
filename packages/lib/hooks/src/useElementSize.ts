import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface ElementSize {
	/** Attach to the element to measure */
	ref: (el: HTMLElement) => void;
	width: Accessor<number>;
	height: Accessor<number>;
}

export interface ElementSizeOptions {
	/** Measure the border box (padding + border included) instead of the content box. @default false */
	borderBox?: boolean;
}

/**
 * Reactive element dimensions via ResizeObserver — re-observes when the
 * bound element changes. Measures the content box by default; pass
 * `borderBox: true` to include padding and border (falls back to
 * `getBoundingClientRect` where `borderBoxSize` is unavailable).
 *
 * @param options — See {@link ElementSizeOptions}
 * @returns `{ ref, width, height }` — attach `ref` to the element
 *
 * @example
 * const size = useElementSize({ borderBox: true });
 * <div ref={size.ref}>{size.width()}×{size.height()}</div>
 */
export function useElementSize(options?: ElementSizeOptions): ElementSize {
	const [el, setEl] = createSignal<HTMLElement>();
	const [width, setWidth] = createSignal(0);
	const [height, setHeight] = createSignal(0);

	createEffect(() => {
		const target = el();
		if (!target || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(([entry]) => {
			if (!entry) return;
			if (options?.borderBox) {
				const box = entry.borderBoxSize[0];
				const fallback = box ? null : target.getBoundingClientRect();
				setWidth(box ? box.inlineSize : (fallback?.width ?? 0));
				setHeight(box ? box.blockSize : (fallback?.height ?? 0));
				return;
			}
			setWidth(entry.contentRect.width);
			setHeight(entry.contentRect.height);
		});
		ro.observe(target, options?.borderBox ? { box: "border-box" } : undefined);
		onCleanup(() => ro.disconnect());
	});

	return { ref: setEl, width, height };
}
