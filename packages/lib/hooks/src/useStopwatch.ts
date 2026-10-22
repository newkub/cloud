import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface StopwatchControls {
	/** Milliseconds elapsed, excluding paused time */
	elapsed: Accessor<number>;
	/** True while the clock is ticking */
	running: Accessor<boolean>;
	/** Recorded lap marks, in milliseconds */
	laps: Accessor<number[]>;
	/** Start or resume the clock */
	start: () => void;
	/** Freeze the clock, keeping `elapsed` */
	pause: () => void;
	/** Zero the clock and clear laps — keeps the current run state */
	reset: () => void;
	/** Record the current elapsed time; returns all lap times so far */
	lap: () => number[];
}

/**
 * `requestAnimationFrame`-driven stopwatch with lap support. `elapsed`
 * updates every paint while running — frame-precise for smooth readouts.
 * SSR-safe: stays at 0 until `start()` is called in the browser.
 *
 * @returns `{ elapsed, running, laps, start, pause, reset, lap }`
 *
 * @example
 * const sw = useStopwatch();
 * <button onClick={sw.running() ? sw.pause : sw.start}>{sw.running() ? "pause" : "start"}</button>
 */
export function useStopwatch(): StopwatchControls {
	const [elapsed, setElapsed] = createSignal(0);
	const [running, setRunning] = createSignal(false);
	const [laps, setLaps] = createSignal<number[]>([]);
	let accumulated = 0;
	let startedAt = 0;
	let frame = 0;

	const tick = (now: number) => {
		setElapsed(accumulated + (now - startedAt));
		frame = requestAnimationFrame(tick);
	};

	const start = () => {
		if (running() || typeof window === "undefined") return;
		startedAt = performance.now();
		setRunning(true);
		frame = requestAnimationFrame(tick);
	};

	const pause = () => {
		if (!running()) return;
		cancelAnimationFrame(frame);
		accumulated += performance.now() - startedAt;
		setElapsed(accumulated);
		setRunning(false);
	};

	const reset = () => {
		accumulated = 0;
		startedAt = performance.now();
		setElapsed(0);
		setLaps([]);
	};

	const lap = () => {
		const times = [...laps(), elapsed()];
		setLaps(times);
		return times;
	};

	onCleanup(() => {
		if (typeof window !== "undefined") cancelAnimationFrame(frame);
	});

	return { elapsed, running, laps, start, pause, reset, lap };
}
