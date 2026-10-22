import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface VisualViewportState {
	/** Vertical offset of the visual viewport vs the layout viewport, in px */
	offsetTop: Accessor<number>;
	/** Horizontal offset of the visual viewport vs the layout viewport, in px */
	offsetLeft: Accessor<number>;
	/** Pinch-zoom scale factor — 1 means unzoomed */
	scale: Accessor<number>;
	/** Visible width in CSS px (excludes the on-screen keyboard) */
	width: Accessor<number>;
	/** Visible height in CSS px (excludes the on-screen keyboard) */
	height: Accessor<number>;
}

/**
 * Track `window.visualViewport` — offsets, scale, and visible size update on
 * visual-viewport `resize`/`scroll` (pinch zoom, on-screen keyboard). Falls
 * back to `innerWidth`/`innerHeight` with zero offsets when the API is
 * missing. SSR-safe.
 *
 * @returns `{ offsetTop, offsetLeft, scale, width, height }` accessors
 *
 * @example
 * const vv = useVisualViewport();
 * <div style={{ transform: `translateY(${vv.offsetTop()}px)` }} />
 */
export function useVisualViewport(): VisualViewportState {
	const [offsetTop, setOffsetTop] = createSignal(0);
	const [offsetLeft, setOffsetLeft] = createSignal(0);
	const [scale, setScale] = createSignal(1);
	const [width, setWidth] = createSignal(0);
	const [height, setHeight] = createSignal(0);

	createEffect(() => {
		if (typeof window === "undefined") return;
		const vv = window.visualViewport;
		const update = () => {
			if (vv) {
				setOffsetTop(vv.offsetTop);
				setOffsetLeft(vv.offsetLeft);
				setScale(vv.scale);
				setWidth(vv.width);
				setHeight(vv.height);
			} else {
				setOffsetTop(0);
				setOffsetLeft(0);
				setScale(1);
				setWidth(window.innerWidth);
				setHeight(window.innerHeight);
			}
		};
		update();
		if (vv) {
			vv.addEventListener("resize", update);
			vv.addEventListener("scroll", update);
			onCleanup(() => {
				vv.removeEventListener("resize", update);
				vv.removeEventListener("scroll", update);
			});
		} else {
			window.addEventListener("resize", update);
			onCleanup(() => window.removeEventListener("resize", update));
		}
	});

	return { offsetTop, offsetLeft, scale, width, height };
}
