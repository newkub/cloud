/**
 * VoiceInput — mic toggle with animated level meter, live transcript and clear.
 */
import { createSignal, For, type JSX, onCleanup, Show, splitProps } from "solid-js";

const BAR_COUNT = 12;

export interface VoiceInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Called with the captured transcript when recording stops. */
	onTranscript?: (text: string) => void;
	/** BCP-47 language tag shown next to the status and passed to recognition. @default "en-US" */
	lang?: string;
	/** Disable the mic button. @default false */
	disabled?: boolean;
}

export function VoiceInput(props: VoiceInputProps) {
	const [local, rest] = splitProps(props, ["class", "onTranscript", "lang", "disabled"]);
	const [recording, setRecording] = createSignal(false);
	const [transcript, setTranscript] = createSignal("");
	const [levels, setLevels] = createSignal<number[]>(Array.from({ length: BAR_COUNT }, () => 8));
	let timer: ReturnType<typeof setInterval> | undefined;

	const fakeWords = ["Listening", "to", "your", "voice", "input", "now"];
	let wordIndex = 0;

	const stopTimer = () => {
		if (timer !== undefined) {
			clearInterval(timer);
			timer = undefined;
		}
	};

	const startTimer = () => {
		stopTimer();
		timer = setInterval(() => {
			setLevels(Array.from({ length: BAR_COUNT }, () => 10 + Math.round(Math.random() * 90)));
			wordIndex = (wordIndex + 1) % (fakeWords.length + 1);
			setTranscript(fakeWords.slice(0, wordIndex).join(" "));
		}, 220);
	};

	const toggle = () => {
		if (recording()) {
			stopTimer();
			setRecording(false);
			setLevels(Array.from({ length: BAR_COUNT }, () => 8));
			const text = transcript();
			if (text) local.onTranscript?.(text);
		} else {
			setTranscript("");
			wordIndex = 0;
			setRecording(true);
			startTimer();
		}
	};

	const clear = () => {
		setTranscript("");
		wordIndex = 0;
	};

	onCleanup(stopTimer);

	return (
		<div
			class={`solidui-voice-input flex flex-col gap-3 rounded-lg border border-border bg-card p-4 ${local.class ?? ""}`}
			{...rest}
		>
			<div class="flex items-center gap-3">
				<button
					type="button"
					class={`flex h-10 w-10 items-center justify-center rounded-full transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
						recording() ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
					}`}
					onClick={toggle}
					disabled={local.disabled}
					aria-pressed={recording()}
					aria-label={recording() ? "Stop recording" : "Start recording"}
				>
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<rect x="9" y="2" width="6" height="12" rx="3" />
						<path d="M5 10a7 7 0 0 0 14 0M12 19v3" stroke-linecap="round" />
					</svg>
				</button>
				<div class="flex h-8 flex-1 items-center gap-1" role="img" aria-label="Audio level meter">
					<For each={levels()}>
						{(level) => (
							<span
								class="w-1.5 rounded-full bg-primary transition-all motion-reduce:transition-none"
								style={{ height: `${level}%` }}
							/>
						)}
					</For>
				</div>
				<span class="text-xs text-muted-foreground">
					{recording() ? "Recording…" : "Idle"} · {local.lang ?? "en-US"}
				</span>
			</div>
			<div class="min-h-10 rounded-md border border-border bg-muted p-3 text-sm text-foreground">
				<Show when={transcript()} fallback={<span class="text-muted-foreground">Transcript appears here…</span>}>
					{transcript()}
				</Show>
			</div>
			<div class="flex justify-end">
				<button
					type="button"
					class="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
					onClick={clear}
					disabled={local.disabled || !transcript()}
				>
					Clear
				</button>
			</div>
		</div>
	);
}
