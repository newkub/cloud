import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface ScrollProgressState {
	/** Scroll fraction from 0 (top) to 1 (bottom) — 0 when nothing can scroll */
	progress: Accessor<number>;
}

/**
 * Scroll completion as a 0–1 fraction — window by default, or an element
 * when `target` is passed (reads `scrollTop` / `scrollHeight`). Updates on
 * scroll and on window resize; stays `0` while there is no scrollable
 * distance. Ideal for reading-progress bars and scroll-linked animations.
 *
 * @param target — Optional accessor for a scrollable element (defaults to window)
 * @returns `{ progress }` accessor in the 0–1 range
 *
 * @example
 * const { progress } = useScrollProgress();
 * <div style={{ width: `${progress() * 100}%` }} />
 * const list = useScrollProgress(() => listEl());
 */
export function useScrollProgress(target?: Accessor<HTMLElement | undefined>): ScrollProgressState {
	const [progress, setProgress] = createSignal(0);

	createEffect(() => {
		if (typeof window === "undefined") return;
		const el = target?.();
		const src: HTMLElement | Window = el ?? window;
		const read = () => {
			const max = el ? el.scrollHeight - el.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
			const y = el ? el.scrollTop : window.scrollY;
			setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
		};
		read();
		src.addEventListener("scroll", read, { passive: true });
		window.addEventListener("resize", read, { passive: true });
		onCleanup(() => {
			src.removeEventListener("scroll", read);
			window.removeEventListener("resize", read);
		});
	});

	return { progress };
}
