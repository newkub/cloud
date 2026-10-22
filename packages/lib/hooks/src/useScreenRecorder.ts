import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface ScreenRecorderOptions {
	/** `DisplayMediaStreamOptions` passed to `getDisplayMedia` — default `{ video: true, audio: false }` */
	displayMedia?: DisplayMediaStreamOptions;
	/** `mimeType` passed to the MediaRecorder constructor */
	mimeType?: string;
	/** Timeslice in ms for periodic `dataavailable` events. @default 250 */
	timeslice?: number;
}

export interface ScreenRecorderState {
	/** `getDisplayMedia` + `MediaRecorder` support flag */
	supported: boolean;
	/** True while a capture is being recorded */
	recording: Accessor<boolean>;
	/** Live display stream returned by `getDisplayMedia` */
	stream: Accessor<MediaStream | undefined>;
	/** Recorded blob — set when `stop()` finishes flushing chunks */
	blob: Accessor<Blob | undefined>;
	/** Last permission/recorder error message (user cancel included) */
	error: Accessor<string | undefined>;
	/** Show the screen picker and begin recording — resolves `false` on cancel/error */
	start: (options?: ScreenRecorderOptions) => Promise<boolean>;
	/** Stop recording, finalize `blob()`, and end the display stream */
	stop: () => void;
}

/**
 * Screen capture + MediaRecorder as signals — `start()` opens the
 * `getDisplayMedia` picker (requires a user gesture) and records the chosen
 * screen/window/tab; `stop()` ends the tracks and produces `blob()`.
 * Tracks also stop automatically if the user ends sharing via the browser
 * UI (`inactive` on the stream). Always cleaned up on dispose.
 * Degrades to `supported: false` where either API is missing.
 *
 * @returns `{ supported, recording, stream, blob, error, start, stop }`
 *
 * @example
 * const rec = useScreenRecorder();
 * <button onClick={() => rec.start()} disabled={!rec.supported || rec.recording()}>share screen</button>
 * <Show when={rec.blob()}>{(b) => <video controls src={URL.createObjectURL(b())} />}</Show>
 */
export function useScreenRecorder(): ScreenRecorderState {
	const supported =
		typeof navigator !== "undefined" &&
		typeof navigator.mediaDevices?.getDisplayMedia === "function" &&
		typeof MediaRecorder !== "undefined";
	const [recording, setRecording] = createSignal(false);
	const [stream, setStream] = createSignal<MediaStream>();
	const [blob, setBlob] = createSignal<Blob>();
	const [error, setError] = createSignal<string>();

	let recorder: MediaRecorder | undefined;
	let chunks: Blob[] = [];

	const stop = () => {
		const r = recorder;
		recorder = undefined;
		if (r && r.state !== "inactive") {
			try {
				r.stop();
			} catch {
				/* already stopped */
			}
		}
		const s = stream();
		if (s) {
			for (const track of s.getTracks()) track.stop();
		}
		setStream(undefined);
		setRecording(false);
	};

	const start = async (options?: ScreenRecorderOptions) => {
		const mediaDevices = typeof navigator === "undefined" ? undefined : navigator.mediaDevices;
		if (!supported || !mediaDevices || typeof MediaRecorder === "undefined") {
			setError("screen recording unavailable");
			return false;
		}
		if (recorder && recorder.state !== "inactive") return true;
		stop();
		let source: MediaStream;
		try {
			source = await mediaDevices.getDisplayMedia(options?.displayMedia ?? { video: true, audio: false });
		} catch (e) {
			setError(e instanceof Error ? e.message : "getDisplayMedia failed");
			return false;
		}
		try {
			recorder = new MediaRecorder(source, options?.mimeType ? { mimeType: options.mimeType } : undefined);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			for (const track of source.getTracks()) track.stop();
			return false;
		}
		chunks = [];
		setBlob(undefined);
		setError(undefined);
		setStream(source);
		const active = recorder;
		active.ondataavailable = (e) => {
			if (e.data.size > 0) chunks.push(e.data);
		};
		active.onerror = () => setError("recorder error");
		active.onstop = () => setBlob(new Blob(chunks, { type: active.mimeType || "video/webm" }));
		source.addEventListener("inactive", stop);
		active.start(options?.timeslice ?? 250);
		setRecording(true);
		return true;
	};

	onMount(() => {
		onCleanup(stop);
	});

	return { supported, recording, stream, blob, error, start, stop };
}
