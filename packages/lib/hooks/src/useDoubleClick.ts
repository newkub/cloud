import { type Accessor, createEffect, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface DoubleClickOptions {
	/**
	 * Single-click handler. With `suppressClick` (default) it is held for
	 * `delay` ms and cancelled when a second click arrives.
	 */
	onClick?: (e: MouseEvent) => void;
	/** Window in ms that merges two clicks into a double click. @default 300 */
	delay?: number;
	/**
	 * Hold the single-click callback until the `delay` window passes —
	 * prevents a double click from also firing `onClick`. @default true
	 */
	suppressClick?: boolean;
}

/**
 * Wire single- vs double-click handling on an element. Counts click events
 * inside a `delay` window: two clicks fire `onDoubleClick`; a lone click
 * fires `onClick` (delayed while `suppressClick` is on). Rebinds when the
 * target changes. SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @param onDoubleClick — Fired when two clicks land within `delay`
 * @param options — See {@link DoubleClickOptions}
 *
 * @example
 * let pad!: HTMLDivElement;
 * useDoubleClick(() => pad, () => setMode("edit"), {
 *   onClick: () => setMode("select"),
 * });
 */
export function useDoubleClick(
	target: MaybeAccessor<HTMLElement | undefined>,
	onDoubleClick: (e: MouseEvent) => void,
	options: DoubleClickOptions = {},
) {
	const { delay = 300, suppressClick = true, onClick } = options;

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		let timer: ReturnType<typeof setTimeout> | undefined;
		let clicks = 0;

		const onClickEvent = (e: MouseEvent) => {
			clicks += 1;
			if (clicks >= 2) {
				clicks = 0;
				clearTimeout(timer);
				timer = undefined;
				onDoubleClick(e);
				return;
			}
			if (!suppressClick) onClick?.(e);
			clearTimeout(timer);
			timer = setTimeout(() => {
				clicks = 0;
				timer = undefined;
				if (suppressClick) onClick?.(e);
			}, delay);
		};

		el.addEventListener("click", onClickEvent);
		onCleanup(() => {
			clearTimeout(timer);
			clicks = 0;
			el.removeEventListener("click", onClickEvent);
		});
	});
}
