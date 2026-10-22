import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface RafLoopControls {
	/** True while frames are being requested */
	running: Accessor<boolean>;
	/** Begin looping — `elapsed` restarts from 0 each start */
	start: () => void;
	/** Stop after the current frame */
	stop: () => void;
}

/**
 * Run `fn` on every animation frame with `(dt, elapsed)` timings in
 * milliseconds — `dt` since the previous frame, `elapsed` since `start()`.
 * SSR-safe: no-ops until mounted in the browser.
 *
 * @param fn — Frame callback `(dt, elapsed) => void`
 * @param options — `autoStart` begins looping on mount
 * @returns `{ running, start, stop }` controls + accessor
 *
 * @example
 * const loop = useRafLoop((dt, elapsed) => setAngle((elapsed / 10) % 360));
 * <button onClick={loop.stop}>halt</button>
 */
export function useRafLoop(
	fn: (dt: number, elapsed: number) => void,
	options?: {
		/** Start looping on mount. @default true */
		autoStart?: boolean;
	},
): RafLoopControls {
	const [running, setRunning] = createSignal(false);
	let frame = 0;
	let startedAt = 0;
	let last = 0;

	const loop = (now: number) => {
		fn(now - last, now - startedAt);
		last = now;
		frame = requestAnimationFrame(loop);
	};

	const start = () => {
		if (running() || typeof window === "undefined") return;
		startedAt = last = performance.now();
		setRunning(true);
		frame = requestAnimationFrame(loop);
	};

	const stop = () => {
		if (!running()) return;
		cancelAnimationFrame(frame);
		setRunning(false);
	};

	onMount(() => {
		if (options?.autoStart !== false) start();
		onCleanup(stop);
	});

	return { running, start, stop };
}
