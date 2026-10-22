import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { useReducedMotion } from "./useReducedMotion";

export interface SpringsOptions {
	/** Spring constant — higher snaps faster. @default 170 */
	stiffness?: number;
	/** Friction — higher settles with less overshoot. @default 26 */
	damping?: number;
	/** Mass — higher feels heavier/slower. @default 1 */
	mass?: number;
	/** Per-index start delay in ms — index `i` waits `i * stagger`. @default 0 */
	stagger?: number;
}

const EPS = 0.01;
const MAX_DT = 0.064;

/**
 * Array version of `useSpring` — every entry of `targets()` chases its goal
 * with a shared damped-spring loop, each index optionally delayed by
 * `i * stagger` ms for cascade effects. Retargeting keeps per-index
 * velocity. With `prefers-reduced-motion` (or no rAF) all values jump
 * instantly. SSR-safe.
 *
 * @param targets — Accessor for the goal array
 * @param options — `stiffness`, `damping`, `mass`, `stagger` tuning
 * @returns Accessor for the animated array
 *
 * @example
 * const [heights, setHeights] = createSignal([0, 0, 0]);
 * const bars = useSprings(heights, { stagger: 60 });
 * <For each={bars()}>{(h) => <div style={{ height: `${h}px` }} />}</For>
 */
export function useSprings(targets: Accessor<number[]>, options?: SpringsOptions): Accessor<number[]> {
	const stiffness = options?.stiffness ?? 170;
	const damping = options?.damping ?? 26;
	const mass = options?.mass ?? 1;
	const stagger = options?.stagger ?? 0;
	const reduced = useReducedMotion();

	const initial = [...targets()];
	let xs = [...initial];
	let velocities = initial.map(() => 0);
	let delays = initial.map(() => 0);
	let goals = [...initial];
	let raf: number | undefined;
	let animating = false;
	let last = -1;
	const [values, setValues] = createSignal<number[]>([...initial]);

	const cancel = () => {
		if (raf !== undefined && typeof cancelAnimationFrame === "function") cancelAnimationFrame(raf);
		raf = undefined;
		animating = false;
	};
	const snap = () => {
		xs = [...goals];
		velocities = goals.map(() => 0);
		delays = goals.map(() => 0);
		setValues([...xs]);
	};

	const tick = (now: number) => {
		if (!animating) return;
		const dt = last < 0 ? 0.016 : Math.min(Math.max((now - last) / 1000, 0), MAX_DT);
		last = now;
		let active = false;
		for (let i = 0; i < goals.length; i++) {
			const delay = delays[i] ?? 0;
			if (delay > 0) {
				delays[i] = delay - dt * 1000;
				active = true;
				continue;
			}
			const goal = goals[i] ?? 0;
			const force = -stiffness * ((xs[i] ?? 0) - goal) - damping * (velocities[i] ?? 0);
			const v = (velocities[i] ?? 0) + (force / mass) * dt;
			const next = (xs[i] ?? 0) + v * dt;
			velocities[i] = v;
			xs[i] = next;
			if (Math.abs(next - goal) < EPS && Math.abs(v) < EPS) {
				xs[i] = goal;
				velocities[i] = 0;
			} else {
				active = true;
			}
		}
		setValues([...xs]);
		if (active) {
			raf = requestAnimationFrame(tick);
		} else {
			cancel();
		}
	};
	const start = () => {
		if (animating || typeof requestAnimationFrame !== "function") return;
		animating = true;
		last = -1;
		raf = requestAnimationFrame(tick);
	};

	createEffect(() => {
		goals = [...targets()];
		const instant = reduced() || typeof requestAnimationFrame !== "function";
		if (instant) {
			cancel();
			snap();
			return;
		}
		// Size the state arrays to the goal list — new indices start settled.
		while (xs.length < goals.length) {
			xs.push(goals[xs.length] ?? 0);
			velocities.push(0);
			delays.push(0);
		}
		xs.length = goals.length;
		velocities.length = goals.length;
		delays.length = goals.length;
		let needs = false;
		for (let i = 0; i < goals.length; i++) {
			if (Math.abs((xs[i] ?? 0) - (goals[i] ?? 0)) >= EPS || Math.abs(velocities[i] ?? 0) >= EPS) {
				delays[i] = i * stagger;
				needs = true;
			} else {
				delays[i] = 0;
			}
		}
		if (!needs) {
			cancel();
			setValues([...xs]);
			return;
		}
		start();
	});

	onCleanup(cancel);

	return () => (reduced() ? targets() : values());
}
