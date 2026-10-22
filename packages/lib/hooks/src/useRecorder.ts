import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface RecorderState {
	/** True while MediaRecorder is capturing */
	recording: Accessor<boolean>;
	/** Recorded blob — set when `stop()` finishes flushing chunks */
	blob: Accessor<Blob | undefined>;
	/** Object URL for `blob()` — revoked on cleanup / next take */
	url: Accessor<string | undefined>;
	/** Last start/recorder error message */
	error: Accessor<string | undefined>;
	/** Elapsed recording time in seconds */
	duration: Accessor<number>;
	/** Whether the MediaRecorder API exists */
	supported: boolean;
	/** Begin recording — requests mic access when no stream was supplied */
	start: () => Promise<void>;
	/** Stop and finalize `blob()`/`url()` */
	stop: () => void;
}

/**
 * MediaRecorder as signals. Pass an existing stream (or accessor) to record
 * it, or omit it and `start()` will request `{ audio: true }` via getUserMedia
 * and stop those tracks when finished. `url()` is a revoked-and-regenerated
 * object URL for the latest take.
 *
 * @param stream — MediaStream or accessor to record — optional
 * @param options — `mimeType` passed to the MediaRecorder constructor
 * @returns `{ recording, blob, url, error, duration, supported, start, stop }`
 *
 * @example
 * const rec = useRecorder();
 * <button onClick={rec.recording() ? rec.stop : rec.start}>{rec.recording() ? "stop" : "record"}</button>
 * <audio controls src={rec.url()} />
 */
export function useRecorder(
	stream?: MaybeAccessor<MediaStream | undefined>,
	options?: { mimeType?: string },
): RecorderState {
	const [recording, setRecording] = createSignal(false);
	const [blob, setBlob] = createSignal<Blob>();
	const [url, setUrl] = createSignal<string>();
	const [error, setError] = createSignal<string>();
	const [duration, setDuration] = createSignal(0);
	const supported = typeof MediaRecorder !== "undefined";

	let recorder: MediaRecorder | undefined;
	let chunks: Blob[] = [];
	let ownedTracks: MediaStreamTrack[] = [];
	let startedAt = 0;
	let timer: ReturnType<typeof setInterval> | undefined;
	let objectUrl: string | undefined;

	const setTake = (b: Blob | undefined) => {
		setBlob(b);
		if (objectUrl) URL.revokeObjectURL(objectUrl);
		objectUrl = b ? URL.createObjectURL(b) : undefined;
		setUrl(objectUrl);
	};

	const stop = () => {
		if (recorder && recorder.state !== "inactive") recorder.stop();
		recorder = undefined;
		for (const track of ownedTracks) track.stop();
		ownedTracks = [];
		clearInterval(timer);
		timer = undefined;
		setRecording(false);
	};

	const start = async () => {
		if (!supported) {
			setError("MediaRecorder unavailable");
			return;
		}
		if (recorder && recorder.state !== "inactive") return;
		let source = resolve(stream);
		if (!source) {
			if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
				setError("getUserMedia unavailable — pass a stream");
				return;
			}
			try {
				source = await navigator.mediaDevices.getUserMedia({ audio: true });
				ownedTracks = source.getTracks();
			} catch (e) {
				setError(e instanceof Error ? e.message : String(e));
				return;
			}
		}
		try {
			recorder = new MediaRecorder(source, options?.mimeType ? { mimeType: options.mimeType } : undefined);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			for (const track of ownedTracks) track.stop();
			ownedTracks = [];
			return;
		}
		chunks = [];
		setTake(undefined);
		setError(undefined);
		const active = recorder;
		active.ondataavailable = (e) => {
			if (e.data.size > 0) chunks.push(e.data);
		};
		active.onerror = () => setError("recorder error");
		active.onstop = () => {
			setTake(new Blob(chunks, { type: active.mimeType || "audio/webm" }));
		};
		active.start(250);
		startedAt = performance.now();
		setDuration(0);
		timer = setInterval(() => setDuration((performance.now() - startedAt) / 1000), 100);
		setRecording(true);
	};

	onMount(() => {
		onCleanup(() => {
			stop();
			if (objectUrl) URL.revokeObjectURL(objectUrl);
			objectUrl = undefined;
		});
	});

	return { recording, blob, url, error, duration, supported, start, stop };
}
