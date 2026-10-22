import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export type AnchorPlacement = "top" | "bottom" | "left" | "right";

export interface ElementAnchorOptions {
	/** Side of the anchor the floating element attaches to — accepts an accessor for reactive placement. @default "bottom" */
	placement?: AnchorPlacement | Accessor<AnchorPlacement>;
	/** Gap in px between the anchor edge and the floating element — accepts an accessor. @default 0 */
	offset?: number | Accessor<number>;
}

export interface ElementAnchorState {
	/** Viewport x of the floating element's anchor point (center for top/bottom, edge for left/right) */
	x: Accessor<number>;
	/** Viewport y of the floating element's anchor point (edge ± offset for top/bottom, center for left/right) */
	y: Accessor<number>;
	/** Anchor width in px */
	width: Accessor<number>;
	/** Anchor height in px */
	height: Accessor<number>;
}

const read = <T>(v: T | Accessor<T> | undefined, fallback: T): T => {
	const value = typeof v === "function" ? (v as Accessor<T>)() : v;
	return value ?? fallback;
};

/**
 * Compute a floating-UI anchor point from an element's viewport rect —
 * `x`/`y` mark where the floater attaches given `placement` and `offset`
 * (e.g. `"top"` → horizontal center, top edge − offset; combine with
 * `transform: translate(-50%, -100%)`). `width`/`height` mirror the anchor
 * box for same-width popovers. Re-measures on scroll (any scroller, via
 * capture) and window resize; re-binds when `anchor()` changes.
 *
 * @param anchor — Accessor for the anchor element
 * @param options — `placement` and `offset` (plain values or accessors)
 * @returns `{ x, y, width, height }` accessors
 *
 * @example
 * const pos = useElementAnchor(() => anchorEl, { placement: "top", offset: 8 });
 * <div class="fixed" style={{ left: `${pos.x()}px`, top: `${pos.y()}px`, transform: "translate(-50%, -100%)" }} />
 */
export function useElementAnchor(
	anchor: Accessor<HTMLElement | undefined>,
	options?: ElementAnchorOptions,
): ElementAnchorState {
	const [x, setX] = createSignal(0);
	const [y, setY] = createSignal(0);
	const [width, setWidth] = createSignal(0);
	const [height, setHeight] = createSignal(0);

	createEffect(() => {
		const el = anchor();
		if (!el || typeof window === "undefined") return;
		const update = () => {
			const r = el.getBoundingClientRect();
			const placement = read(options?.placement, "bottom");
			const offset = read(options?.offset, 0);
			setWidth(r.width);
			setHeight(r.height);
			switch (placement) {
				case "top":
					setX(r.left + r.width / 2);
					setY(r.top - offset);
					break;
				case "left":
					setX(r.left - offset);
					setY(r.top + r.height / 2);
					break;
				case "right":
					setX(r.right + offset);
					setY(r.top + r.height / 2);
					break;
				default:
					setX(r.left + r.width / 2);
					setY(r.bottom + offset);
			}
		};
		update();
		window.addEventListener("scroll", update, { capture: true, passive: true });
		window.addEventListener("resize", update, { passive: true });
		onCleanup(() => {
			window.removeEventListener("scroll", update, { capture: true });
			window.removeEventListener("resize", update);
		});
	});

	return { x, y, width, height };
}
