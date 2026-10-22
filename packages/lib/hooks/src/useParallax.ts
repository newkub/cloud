import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface ParallaxOptions {
	/**
	 * Parallax factor — `0` disables movement, `0.5` travels at half scroll
	 * speed, negative values move against the scroll direction. @default 0.5
	 */
	speed?: number;
}

export interface ParallaxState {
	/** Px to translate the element — distance from viewport centre × `speed` */
	offset: Accessor<number>;
}

/**
 * Scroll-linked parallax offset — `offset()` is the element centre's
 * distance from the viewport centre multiplied by `speed`, refreshed on
 * `scroll`/`resize` and whenever the bound element changes. Apply it as a
 * `translateY`. jsdom-safe: tracks listeners but rects are `0`.
 *
 * @param ref — Element or accessor returning it
 * @param options — `speed` multiplier. @default 0.5
 * @returns `{ offset }`
 *
 * @example
 * const hero = useParallax(() => heroEl(), { speed: 0.4 });
 * <img ref={heroEl} style={{ transform: `translateY(${hero.offset()}px)` }} />
 */
export function useParallax(ref: MaybeAccessor<HTMLElement | undefined>, options?: ParallaxOptions): ParallaxState {
	const speed = options?.speed ?? 0.5;
	const [offset, setOffset] = createSignal(0);

	createEffect(() => {
		const el = read(ref);
		if (!el || typeof window === "undefined") return;
		const update = () => {
			const rect = el.getBoundingClientRect();
			const distance = rect.top + rect.height / 2 - window.innerHeight / 2;
			setOffset(distance * speed);
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		onCleanup(() => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		});
	});

	return { offset };
}
