import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface ScrollTweenOptions {
	/** Scroll container — defaults to `window` */
	target?: MaybeAccessor<HTMLElement | Window | undefined>;
	/** Scroll offset (px) where progress is `0`. @default 0 */
	start?: number;
	/** Scroll offset (px) where progress is `1`. @default scrollable range */
	end?: number;
}

const scrollPos = (el: HTMLElement | Window): number => (el instanceof HTMLElement ? el.scrollTop : (el.scrollY ?? 0));

const scrollRange = (el: HTMLElement | Window): number => {
	if (el instanceof HTMLElement) return Math.max(0, el.scrollHeight - el.clientHeight);
	const doc = el.document?.documentElement;
	return Math.max(0, (doc?.scrollHeight ?? 0) - (el.innerHeight ?? 0));
};

/**
 * Normalised scroll progress — `progress()` runs `0 → 1` as the target
 * scrolls from `start` to `end` pixels (default: the full scrollable
 * range). Recomputed on `scroll` and `resize`; jsdom-safe.
 *
 * @param options — `target`, `start`, `end`
 * @returns `{ progress }` — accessor clamped to `[0, 1]`
 *
 * @example
 * const { progress } = useScrollTween({ start: 0, end: 800 });
 * <div style={{ opacity: progress() }} />
 */
export function useScrollTween(options?: ScrollTweenOptions): { progress: Accessor<number> } {
	const [progress, setProgress] = createSignal(0);
	const start = options?.start ?? 0;

	const update = (el: HTMLElement | Window) => {
		const end = options?.end ?? scrollRange(el);
		const span = end - start;
		setProgress(span <= 0 ? 0 : Math.min(1, Math.max(0, (scrollPos(el) - start) / span)));
	};

	createEffect(() => {
		if (typeof window === "undefined") return;
		const el = read(options?.target) ?? window;
		const onScroll = () => update(el);
		update(el);
		el.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		onCleanup(() => {
			el.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		});
	});

	return { progress };
}
