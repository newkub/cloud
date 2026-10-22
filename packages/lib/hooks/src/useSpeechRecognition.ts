import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

interface SpeechRecognitionResultLike {
	readonly isFinal: boolean;
	readonly 0: { readonly transcript: string };
}

interface SpeechRecognitionEventLike {
	readonly resultIndex: number;
	readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	onresult: ((event: SpeechRecognitionEventLike) => void) | null;
	onend: (() => void) | null;
	onerror: ((event: { error?: string }) => void) | null;
	start(): void;
	stop(): void;
	abort(): void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const ctor = (): SpeechRecognitionCtor | undefined => {
	if (typeof window === "undefined") return undefined;
	const w = window as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
	return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export interface SpeechRecognitionOptions {
	/** BCP-47 tag, e.g. `"en-US"` */
	lang?: string;
	/** Keep listening after each result. @default false */
	continuous?: boolean;
	/** Stream interim (non-final) results into `interim()`. @default true */
	interimResults?: boolean;
}

export interface SpeechRecognitionState {
	/** SpeechRecognition / webkitSpeechRecognition support flag */
	supported: boolean;
	/** True between `start()` and `end`/`stop()` */
	listening: Accessor<boolean>;
	/** Concatenated final transcripts */
	transcript: Accessor<string>;
	/** Current non-final hypothesis */
	interim: Accessor<string>;
	/** Last recognition error code (e.g. `"not-allowed"`) */
	error: Accessor<string | undefined>;
	/** Begin capturing — no-op when unsupported */
	start: () => void;
	/** Stop capturing */
	stop: () => void;
}

/**
 * Speech Recognition API — `start()`/`stop()` with `transcript()` for final
 * results and `interim()` for live hypotheses. `supported` is `false` where
 * neither `SpeechRecognition` nor `webkitSpeechRecognition` exists; calls
 * then no-op instead of throwing.
 *
 * @param options — `{ lang, continuous, interimResults }`
 * @returns `{ supported, listening, transcript, interim, error, start, stop }`
 *
 * @example
 * const rec = useSpeechRecognition({ lang: "en-US", continuous: true });
 * <button onClick={() => (rec.listening() ? rec.stop() : rec.start())}>🎙</button>
 * <p>{rec.transcript()}{rec.interim()}</p>
 */
export function useSpeechRecognition(options?: SpeechRecognitionOptions): SpeechRecognitionState {
	const Ctor = ctor();
	const supported = Ctor !== undefined;
	const [listening, setListening] = createSignal(false);
	const [transcript, setTranscript] = createSignal("");
	const [interim, setInterim] = createSignal("");
	const [error, setError] = createSignal<string>();
	let rec: SpeechRecognitionLike | undefined;

	const start = () => {
		if (!Ctor) return;
		rec?.abort();
		const r = new Ctor();
		rec = r;
		r.lang = options?.lang ?? "";
		r.continuous = options?.continuous ?? false;
		r.interimResults = options?.interimResults ?? true;
		r.onresult = (e) => {
			let finals = "";
			let live = "";
			for (let i = 0; i < e.results.length; i++) {
				const res = e.results[i];
				if (!res) continue;
				if (res.isFinal) finals += res[0].transcript;
				else live += res[0].transcript;
			}
			setTranscript(finals);
			setInterim(live);
		};
		r.onend = () => {
			setListening(false);
			setInterim("");
		};
		r.onerror = (e) => setError(e.error ?? "speech recognition error");
		try {
			r.start();
			setListening(true);
			setError(undefined);
		} catch (e) {
			setError(e instanceof Error ? e.message : "start failed");
		}
	};

	const stop = () => {
		try {
			rec?.stop();
		} catch {
			// already stopped
		}
		setListening(false);
	};

	onMount(() => {
		onCleanup(() => {
			try {
				rec?.abort();
			} catch {
				// already aborted
			}
			rec = undefined;
		});
	});

	return { supported, listening, transcript, interim, error, start, stop };
}
