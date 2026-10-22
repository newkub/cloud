import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface FpsState {
	/** Frames per second, recomputed every `sampleMs` */
	fps: Accessor<number>;
	/** True while the rAF loop is running */
	running: Accessor<boolean>;
	/** Start sampling — no-op when rAF is unavailable or already running */
	start: () => void;
	/** Stop sampling */
	stop: () => void;
}

/**
 * Measure frame rate with a `requestAnimationFrame` loop — `fps` is
 * recomputed every `sampleMs` from the frames counted in that window.
 * Starts automatically unless `autoStart: false`. SSR/jsdom-safe: `start`
 * no-ops without `requestAnimationFrame`.
 *
 * @param options — `sampleMs` measurement window; `autoStart` begins on mount. @default sampleMs 1000, autoStart true
 * @returns `{ fps, running, start, stop }`
 *
 * @example
 * const { fps, running } = useFps({ sampleMs: 500 });
 * <span class={fps() < 30 ? "slow" : ""}>{fps()} fps</span>
 */
export function useFps(options?: {
	/** Sampling window in ms. @default 1000 */
	sampleMs?: number;
	/** Begin the loop on mount. @default true */
	autoStart?: boolean;
}): FpsState {
	const sampleMs = options?.sampleMs ?? 1000;
	const [fps, setFps] = createSignal(0);
	const [running, setRunning] = createSignal(false);
	let raf = 0;
	let frames = 0;
	let sampleStart = -1;

	const loop = (now: number) => {
		if (!running()) return;
		if (sampleStart < 0) sampleStart = now;
		frames++;
		const elapsed = now - sampleStart;
		if (elapsed >= sampleMs) {
			setFps(Math.round((frames * 1000) / elapsed));
			frames = 0;
			sampleStart = now;
		}
		raf = requestAnimationFrame(loop);
	};

	const start = () => {
		if (running() || typeof requestAnimationFrame !== "function") return;
		setRunning(true);
		frames = 0;
		sampleStart = -1;
		raf = requestAnimationFrame(loop);
	};

	const stop = () => {
		setRunning(false);
		if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(raf);
	};

	onMount(() => {
		if (options?.autoStart !== false) start();
	});
	onCleanup(stop);

	return { fps, running, start, stop };
}
