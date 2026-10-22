import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface MotionValueAnimateOptions {
	/** Tween duration in milliseconds. @default 300 */
	duration?: number;
	/** Easing `t ∈ [0,1] → progress`. @default cubic ease-out */
	ease?: (t: number) => number;
	/** Called when the animation reaches the target (not on cancel). */
	onComplete?: () => void;
}

export interface MotionValue {
	/** Current value */
	get: Accessor<number>;
	/** Jump to a value immediately — cancels any running animation */
	set: (v: number) => void;
	/**
	 * Tween toward `to` over `opts.duration` — returns a cancel function.
	 * Without `requestAnimationFrame` (or with `duration <= 0`) jumps instantly.
	 */
	animate: (to: number, opts?: MotionValueAnimateOptions) => () => void;
	/** Instantaneous velocity in units/second — `0` while idle */
	velocity: Accessor<number>;
	/** True while an animation is in flight */
	animating: Accessor<boolean>;
	/** Cancel the running animation, keeping the current value */
	stop: () => void;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Animated scalar — `get`/`set` plus `animate(to, { duration, ease })`
 * tweening driven by `requestAnimationFrame`. `velocity` reports units per
 * second while animating. jsdom-safe: jumps to the target when rAF is
 * missing.
 *
 * @param initial — Starting value. @default 0
 * @returns `{ get, set, animate, velocity, animating, stop }`
 *
 * @example
 * const x = useMotionValue(0);
 * x.animate(100, { duration: 250 });
 * <div style={{ transform: `translateX(${x.get()}px)` }} />
 */
export function useMotionValue(initial = 0): MotionValue {
	const [get, setGet] = createSignal(initial);
	const [velocity, setVelocity] = createSignal(0);
	const [animating, setAnimating] = createSignal(false);
	let raf: number | undefined;
	let cancelCurrent: (() => void) | undefined;

	const settle = () => {
		raf = undefined;
		cancelCurrent = undefined;
		setAnimating(false);
		setVelocity(0);
	};

	const stop = () => cancelCurrent?.();

	const animate = (to: number, opts?: MotionValueAnimateOptions): (() => void) => {
		stop();
		const duration = opts?.duration ?? 300;
		const ease = opts?.ease ?? easeOutCubic;
		if (typeof requestAnimationFrame !== "function" || duration <= 0 || to === get()) {
			setGet(to);
			opts?.onComplete?.();
			return () => {};
		}
		const from = get();
		let startT: number | undefined;
		let lastT: number | undefined;
		let lastV = from;
		let cancelled = false;
		setAnimating(true);
		const step = (t: number) => {
			if (cancelled) return;
			if (startT === undefined) {
				startT = t;
				lastT = t;
			}
			const k = Math.min(1, (t - startT) / duration);
			const v = from + (to - from) * ease(k);
			if (lastT !== undefined && t > lastT) setVelocity(((v - lastV) / (t - lastT)) * 1000);
			lastT = t;
			lastV = v;
			setGet(v);
			if (k >= 1) {
				settle();
				opts?.onComplete?.();
				return;
			}
			raf = requestAnimationFrame(step);
		};
		raf = requestAnimationFrame(step);
		cancelCurrent = () => {
			cancelled = true;
			if (raf !== undefined && typeof cancelAnimationFrame === "function") cancelAnimationFrame(raf);
			settle();
		};
		return cancelCurrent;
	};

	onCleanup(stop);

	return {
		get,
		set: (v) => {
			stop();
			setGet(v);
		},
		animate,
		velocity,
		animating,
		stop,
	};
}
