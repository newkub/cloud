import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface ScrollVelocityState {
	/** Vertical scroll speed in px/sec — positive scrolling down, negative up. Decays toward 0 between events. */
	velocity: Accessor<number>;
}

const DECAY_MS = 50;
const DECAY_FACTOR = 0.5;
const MIN_VELOCITY = 1;

/**
 * Signed vertical scroll velocity in px/sec — each `scroll` event divides
 * the offset change by elapsed time, then a decay timer halves the value
 * every `decayMs` until it settles at 0. Tracks the window by default or an
 * element when `element` is passed. SSR-safe.
 *
 * @param options — `element` scrollable element/accessor; `decayMs` decay interval. @default window, decayMs 50
 * @returns `{ velocity }` accessor
 *
 * @example
 * const { velocity } = useScrollVelocity();
 * <header class={Math.abs(velocity()) > 800 ? "collapsed" : ""} />
 */
export function useScrollVelocity(options?: {
	/** Element/accessor to measure — defaults to window */
	element?: MaybeAccessor<HTMLElement | undefined>;
	/** Interval in ms between decay halvings. @default 50 */
	decayMs?: number;
}): ScrollVelocityState {
	const decayMs = options?.decayMs ?? DECAY_MS;
	const [velocity, setVelocity] = createSignal(0);

	createEffect(() => {
		if (typeof window === "undefined") return;
		const el = options?.element === undefined ? undefined : read(options.element);
		const src: HTMLElement | Window = el ?? window;
		let lastPos = el ? el.scrollTop : window.scrollY;
		let lastTime = Date.now();
		let timer: ReturnType<typeof setInterval> | undefined;

		const stopDecay = () => {
			clearInterval(timer);
			timer = undefined;
		};
		const startDecay = () => {
			stopDecay();
			timer = setInterval(() => {
				const next = velocity() * DECAY_FACTOR;
				if (Math.abs(next) < MIN_VELOCITY) {
					setVelocity(0);
					stopDecay();
				} else {
					setVelocity(next);
				}
			}, decayMs);
		};
		const onScroll = () => {
			const now = Date.now();
			const pos = el ? el.scrollTop : window.scrollY;
			const dt = now - lastTime;
			if (dt > 0) setVelocity(((pos - lastPos) / dt) * 1000);
			lastPos = pos;
			lastTime = now;
			startDecay();
		};

		src.addEventListener("scroll", onScroll, { passive: true });
		onCleanup(() => {
			stopDecay();
			src.removeEventListener("scroll", onScroll);
			setVelocity(0);
		});
	});

	return { velocity };
}
