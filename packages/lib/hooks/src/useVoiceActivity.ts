import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface VoiceActivityState {
	/** Whether `getUserMedia` + `AudioContext` are both available */
	supported: boolean;
	/** True while the mic level exceeds `threshold` — i.e. speech detected */
	active: Accessor<boolean>;
	/** True while the microphone is captured and being sampled */
	capturing: Accessor<boolean>;
	/** Smoothed RMS input level, roughly 0–1 */
	level: Accessor<number>;
	/** Error message from a failed `getUserMedia`/AudioContext setup */
	error: Accessor<string | undefined>;
	/** Request the mic and start sampling — resolves once the pipeline is live */
	start: () => Promise<void>;
	/** Release the mic, close the AudioContext and reset level/active */
	stop: () => void;
}

/**
 * Voice-activity detection from the microphone — `getUserMedia({ audio })`
 * feeds a Web Audio `AnalyserNode` sampled on an interval; the RMS `level`
 * drives `active()` once it crosses `threshold`. `start()`/`stop()` are
 * manual so the mic is only requested on demand; everything is released on
 * cleanup. Degrades to `supported: false` where the APIs are missing —
 * never throws.
 *
 * @param options — `threshold` RMS level counted as speech @default 0.05 — `intervalMs` sampling period @default 50
 * @returns `{ supported, active, capturing, level, error, start, stop }`
 *
 * @example
 * const vad = useVoiceActivity({ threshold: 0.08 });
 * <button onClick={() => vad.start()}>🎙</button>
 * <Show when={vad.active()}>speaking…</Show>
 */
export function useVoiceActivity(options?: {
	/** RMS level (0–1) at or above which `active()` is true. @default 0.05 */
	threshold?: number;
	/** Sampling period in milliseconds. @default 50 */
	intervalMs?: number;
}): VoiceActivityState {
	const [active, setActive] = createSignal(false);
	const [capturing, setCapturing] = createSignal(false);
	const [level, setLevel] = createSignal(0);
	const [error, setError] = createSignal<string>();
	const supported =
		typeof navigator !== "undefined" &&
		typeof navigator.mediaDevices?.getUserMedia === "function" &&
		typeof AudioContext !== "undefined";

	let stream: MediaStream | undefined;
	let ctx: AudioContext | undefined;
	let timer: ReturnType<typeof setInterval> | undefined;
	let running = false;

	const teardown = () => {
		if (timer !== undefined) {
			clearInterval(timer);
			timer = undefined;
		}
		for (const track of stream?.getTracks() ?? []) track.stop();
		stream = undefined;
		if (ctx) {
			void ctx.close().catch(() => {});
			ctx = undefined;
		}
		setLevel(0);
		setActive(false);
		setCapturing(false);
	};

	const start = async () => {
		if (running || !supported) return;
		running = true;
		let media: MediaStream;
		try {
			media = await navigator.mediaDevices.getUserMedia({ audio: true });
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			running = false;
			return;
		}
		if (!running) {
			// stop() ran while getUserMedia was pending
			for (const track of media.getTracks()) track.stop();
			return;
		}
		let context: AudioContext;
		try {
			context = new AudioContext();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			for (const track of media.getTracks()) track.stop();
			running = false;
			return;
		}
		stream = media;
		ctx = context;
		const analyser = context.createAnalyser();
		analyser.fftSize = 512;
		const data = new Uint8Array(analyser.fftSize);
		try {
			context.createMediaStreamSource(media).connect(analyser);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			teardown();
			running = false;
			return;
		}
		if (context.state === "suspended") void context.resume().catch(() => {});
		setCapturing(true);
		timer = setInterval(() => {
			analyser.getByteTimeDomainData(data);
			let sum = 0;
			for (const byte of data) {
				const v = (byte - 128) / 128;
				sum += v * v;
			}
			const rms = Math.min(1, Math.sqrt(sum / data.length));
			setLevel(rms);
			setActive(rms >= (options?.threshold ?? 0.05));
		}, options?.intervalMs ?? 50);
	};

	const stop = () => {
		running = false;
		teardown();
	};

	onCleanup(stop);

	return { supported, active, capturing, level, error, start, stop };
}
