import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { useReducedMotion } from "./useReducedMotion";

export interface SpringOptions {
	/** Spring constant — higher snaps faster. @default 170 */
	stiffness?: number;
	/** Friction — higher settles with less overshoot. @default 26 */
	damping?: number;
	/** Mass — higher feels heavier/slower. @default 1 */
	mass?: number;
}

const EPS = 0.01;
const MAX_DT = 0.064;

/**
 * Spring-animated number — returns an accessor that chases `target` with a
 * damped spring driven by `requestAnimationFrame`. Retargeting mid-flight
 * keeps the current velocity for smooth interruption. When
 * `prefers-reduced-motion` is set (or rAF is unavailable) the value jumps
 * instantly. SSR-safe.
 *
 * @param target — Accessor for the goal value
 * @param options — `stiffness`, `damping`, `mass` physics tuning
 * @returns Accessor for the animated value
 *
 * @example
 * const [height, setHeight] = createSignal(0);
 * const animated = useSpring(height, { stiffness: 120, damping: 18 });
 * <div style={{ height: `${animated()}px` }} />
 */
export function useSpring(target: Accessor<number>, options?: SpringOptions): Accessor<number> {
	const stiffness = options?.stiffness ?? 170;
	const damping = options?.damping ?? 26;
	const mass = options?.mass ?? 1;
	const reduced = useReducedMotion();

	let x = target();
	let velocity = 0;
	let goal = x;
	let raf: number | undefined;
	let animating = false;
	let last = -1;
	const [value, setValue] = createSignal(x);

	const setX = (v: number) => {
		x = v;
		setValue(v);
	};
	const cancel = () => {
		if (raf !== undefined && typeof cancelAnimationFrame === "function") cancelAnimationFrame(raf);
		raf = undefined;
		animating = false;
	};
	const tick = (now: number) => {
		if (!animating) return;
		const dt = last < 0 ? 0.016 : Math.min(Math.max((now - last) / 1000, 0), MAX_DT);
		last = now;
		const force = -stiffness * (x - goal) - damping * velocity;
		velocity += (force / mass) * dt;
		setX(x + velocity * dt);
		if (Math.abs(x - goal) < EPS && Math.abs(velocity) < EPS) {
			setX(goal);
			velocity = 0;
			cancel();
			return;
		}
		raf = requestAnimationFrame(tick);
	};
	const start = () => {
		if (animating || typeof requestAnimationFrame !== "function") return;
		animating = true;
		last = -1;
		raf = requestAnimationFrame(tick);
	};

	createEffect(() => {
		goal = target();
		const instant = reduced() || typeof requestAnimationFrame !== "function";
		if (instant) {
			cancel();
			velocity = 0;
			setX(goal);
			return;
		}
		if (Math.abs(x - goal) < EPS && Math.abs(velocity) < EPS) {
			cancel();
			setX(goal);
			velocity = 0;
			return;
		}
		start();
	});

	onCleanup(cancel);

	return () => (reduced() ? target() : value());
}
