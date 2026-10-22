import { type Accessor, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

export interface GridSizeOptions {
	/** Minimum px width each item should get before wrapping. @default 160 */
	minItemWidth?: number;
	/** Gap between items in px. @default 0 */
	gap?: number;
	/** Hard cap on the column count. @default unlimited */
	maxColumns?: number;
}

export interface GridSize {
	/** Attach to the grid container to measure */
	ref: (el: HTMLElement) => void;
	/** Measured container width in px */
	width: Accessor<number>;
	/** How many `minItemWidth` columns fit — at least `1` */
	columns: Accessor<number>;
	/** Resulting px width per column given the gap */
	itemWidth: Accessor<number>;
}

/**
 * Responsive grid math — observes the container with ResizeObserver and
 * derives how many `minItemWidth`-plus-`gap` columns fit, and the real
 * `itemWidth` each column gets. jsdom-safe: stays at `1` column / `0` px
 * without ResizeObserver.
 *
 * @param options — `minItemWidth`, `gap`, `maxColumns`
 * @returns `{ ref, width, columns, itemWidth }`
 *
 * @example
 * const grid = useGridSize({ minItemWidth: 220, gap: 16 });
 * <div ref={grid.ref} style={{ "grid-template-columns": `repeat(${grid.columns()}, 1fr)` }} />
 */
export function useGridSize(options?: GridSizeOptions): GridSize {
	const min = options?.minItemWidth ?? 160;
	const gap = options?.gap ?? 0;
	const maxColumns = options?.maxColumns ?? Number.POSITIVE_INFINITY;
	const [el, setEl] = createSignal<HTMLElement>();
	const [width, setWidth] = createSignal(0);

	createEffect(() => {
		const target = el();
		if (!target || typeof ResizeObserver === "undefined") return;
		const ro = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width ?? 0));
		ro.observe(target);
		onCleanup(() => ro.disconnect());
	});

	const columns = createMemo(() => {
		const w = width();
		if (w <= 0) return 1;
		return Math.max(1, Math.min(maxColumns, Math.floor((w + gap) / (min + gap))));
	});

	const itemWidth = createMemo(() => {
		const cols = columns();
		const w = width();
		if (w <= 0 || cols <= 0) return 0;
		return (w - (cols - 1) * gap) / cols;
	});

	return { ref: setEl, width, columns, itemWidth };
}
