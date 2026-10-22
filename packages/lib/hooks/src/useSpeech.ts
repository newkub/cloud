import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface SpeakOptions {
	/** Voice to use — pick from `voices()` */
	voice?: SpeechSynthesisVoice;
	/** BCP-47 tag used when `voice` is omitted */
	lang?: string;
	/** 0.1–10, default 1 */
	rate?: number;
	/** 0–2, default 1 */
	pitch?: number;
	/** 0–1, default 1 */
	volume?: number;
}

export interface SpeechState {
	/** `speechSynthesis` support flag */
	supported: boolean;
	/** True while an utterance is playing */
	speaking: Accessor<boolean>;
	/** Installed voices — fills in after `voiceschanged` */
	voices: Accessor<SpeechSynthesisVoice[]>;
	/** Queue an utterance; no-op when unsupported */
	speak: (text: string, options?: SpeakOptions) => void;
	/** Stop speaking and clear the queue */
	cancel: () => void;
}

/**
 * Speech Synthesis API — `speak(text, opts)` with reactive `speaking()` and
 * `voices()`. Cancels any pending utterance on unmount; `supported` is
 * `false` where `speechSynthesis` is missing.
 *
 * @returns `{ supported, speaking, voices, speak, cancel }`
 *
 * @example
 * const tts = useSpeech();
 * <button disabled={!tts.supported} onClick={() => tts.speak("Hello")}>Speak</button>
 */
export function useSpeech(): SpeechState {
	const supported = typeof window !== "undefined" && "speechSynthesis" in window;
	const [speaking, setSpeaking] = createSignal(false);
	const [voices, setVoices] = createSignal<SpeechSynthesisVoice[]>([]);

	const speak = (text: string, options?: SpeakOptions) => {
		if (!supported) return;
		const u = new SpeechSynthesisUtterance(text);
		if (options?.voice) u.voice = options.voice;
		if (options?.lang) u.lang = options.lang;
		if (options?.rate !== undefined) u.rate = options.rate;
		if (options?.pitch !== undefined) u.pitch = options.pitch;
		if (options?.volume !== undefined) u.volume = options.volume;
		u.onstart = () => setSpeaking(true);
		u.onend = () => setSpeaking(false);
		u.onerror = () => setSpeaking(false);
		speechSynthesis.speak(u);
	};

	const cancel = () => {
		if (!supported) return;
		speechSynthesis.cancel();
		setSpeaking(false);
	};

	onMount(() => {
		if (!supported) return;
		const load = () => setVoices(speechSynthesis.getVoices());
		load();
		speechSynthesis.addEventListener("voiceschanged", load);
		onCleanup(() => {
			speechSynthesis.removeEventListener("voiceschanged", load);
			speechSynthesis.cancel();
		});
	});

	return { supported, speaking, voices, speak, cancel };
}
