import { type Accessor, createSignal, onMount } from "solid-js";

export interface ScrollbarSize {
	/** Vertical scrollbar width in px (`0` on overlay scrollbars / jsdom) */
	width: Accessor<number>;
	/** Horizontal scrollbar height in px */
	height: Accessor<number>;
	/** Re-run the offscreen measurement */
	remeasure: () => void;
}

/**
 * Native scrollbar thickness measured once with an offscreen
 * `overflow: scroll` probe element — `offsetWidth − clientWidth`. Useful
 * for compensating layout shift when scrollbars appear. SSR/jsdom-safe:
 * reports `0` until a real measurement is possible.
 *
 * @returns `{ width, height, remeasure }`
 *
 * @example
 * const sb = useScrollbarSize();
 * <div style={{ "padding-right": `${sb.width()}px` }} />
 */
export function useScrollbarSize(): ScrollbarSize {
	const [width, setWidth] = createSignal(0);
	const [height, setHeight] = createSignal(0);

	const measure = () => {
		if (typeof document === "undefined" || !document.body) return;
		const probe = document.createElement("div");
		probe.style.cssText =
			"position:absolute;top:-9999px;left:-9999px;width:100px;height:100px;overflow:scroll;visibility:hidden;";
		document.body.appendChild(probe);
		setWidth(Math.max(0, probe.offsetWidth - probe.clientWidth));
		setHeight(Math.max(0, probe.offsetHeight - probe.clientHeight));
		probe.remove();
	};

	onMount(measure);

	return { width, height, remeasure: measure };
}
