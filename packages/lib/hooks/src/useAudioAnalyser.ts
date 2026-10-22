import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface AudioAnalyserState {
	/** Latest frequency-bin magnitudes (0–255 per bin, `fftSize / 2` bins) — empty until `start()` */
	data: Accessor<Uint8Array>;
	/** True while the rAF sampling loop is running */
	active: Accessor<boolean>;
	/** Last error message (missing AudioContext, element already bound, …) */
	error: Accessor<string | undefined>;
	/** Whether `AudioContext` exists */
	supported: boolean;
	/** Attach a MediaStream (mic) or a media element — element sources stay audible */
	start: (source: MediaStream | HTMLMediaElement) => Promise<void>;
	/** Stop sampling and close the AudioContext */
	stop: () => void;
}

/**
 * Web Audio `AnalyserNode` frequency data as a signal — `start()` accepts a
 * `MediaStream` (e.g. from `useMediaStream`) or an `HTMLMediaElement` and
 * samples `getByteFrequencyData` every animation frame into `data()`.
 * Element sources are routed analyser → destination so playback stays
 * audible. `stop()` cancels the loop and closes the AudioContext; both run
 * automatically on unmount. SSR-safe: `supported` is `false` without
 * `AudioContext` — never throws.
 *
 * @returns `{ data, active, error, supported, start, stop }`
 *
 * @example
 * const mic = useMediaStream({ audio: true });
 * const an = useAudioAnalyser();
 * <button onClick={async () => an.start((await mic.start())!)}>visualize</button>
 * <For each={[...an.data()]}>{(v) => <Bar height={v} />}</For>
 */
export function useAudioAnalyser(): AudioAnalyserState {
	const [data, setData] = createSignal<Uint8Array>(new Uint8Array(0));
	const [active, setActive] = createSignal(false);
	const [error, setError] = createSignal<string>();
	const supported = typeof AudioContext !== "undefined";
	let ctx: AudioContext | undefined;
	let raf = 0;

	const stop = () => {
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
		if (ctx) void ctx.close().catch(() => {});
		ctx = undefined;
		setActive(false);
	};

	const start = async (source: MediaStream | HTMLMediaElement) => {
		if (!supported) {
			setError("AudioContext unavailable");
			return;
		}
		stop();
		setError(undefined);
		const next = new AudioContext();
		const analyser = next.createAnalyser();
		analyser.fftSize = 2048;
		try {
			let node: MediaStreamAudioSourceNode | MediaElementAudioSourceNode;
			if (typeof MediaStream !== "undefined" && source instanceof MediaStream) {
				node = next.createMediaStreamSource(source);
			} else {
				node = next.createMediaElementSource(source as HTMLMediaElement);
				analyser.connect(next.destination);
			}
			node.connect(analyser);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			void next.close().catch(() => {});
			return;
		}
		ctx = next;
		if (next.state === "suspended") void next.resume().catch(() => {});
		setActive(true);
		const buf = new Uint8Array(analyser.frequencyBinCount);
		const loop = () => {
			analyser.getByteFrequencyData(buf);
			setData(buf.slice());
			raf = requestAnimationFrame(loop);
		};
		loop();
	};

	onCleanup(stop);

	return { data, active, error, supported, start, stop };
}
