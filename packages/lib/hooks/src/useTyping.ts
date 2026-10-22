import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface TypingOptions {
	/** Milliseconds between characters. @default 40 */
	speed?: number;
	/** Milliseconds to wait before the first character. @default 0 */
	startDelay?: number;
}

export interface TypingControls {
	/** The text typed so far — grows one character per `speed` interval */
	output: Accessor<string>;
	/** True once the full text has been typed (or the text is empty) */
	done: Accessor<boolean>;
	/** Clear the output and type the current text again from scratch */
	restart: () => void;
	/** Freeze the output — the timer is cleared */
	pause: () => void;
	/** Continue from where `pause()` stopped — no-op once `done()` */
	resume: () => void;
}

/**
 * Typewriter effect as a signal — reveals `text` one character per `speed`
 * millisecond after an optional `startDelay`. Reactive: restarts when the
 * text accessor changes. `pause()`/`resume()` freeze and continue mid-word,
 * `restart()` retypes from scratch. Uses `setTimeout`, so it is fully
 * SSR-safe and fake-timer friendly. The timer is cleared on cleanup.
 *
 * @param text — String or accessor resolving to the full text
 * @param options — `{ speed, startDelay }`
 * @returns `{ output, done, restart, pause, resume }`
 *
 * @example
 * const t = useTyping("hello world", { speed: 50 });
 * <p>{t.output()}<Show when={!t.done()}>▍</Show></p>
 */
export function useTyping(text: MaybeAccessor<string>, options?: TypingOptions): TypingControls {
	const [output, setOutput] = createSignal("");
	const [done, setDone] = createSignal(false);
	const speed = () => options?.speed ?? 40;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let full = "";
	let index = 0;

	const clearTimer = () => {
		if (timer !== undefined) clearTimeout(timer);
		timer = undefined;
	};

	const tick = () => {
		index += 1;
		setOutput(full.slice(0, index));
		if (index >= full.length) {
			setDone(true);
			timer = undefined;
			return;
		}
		timer = setTimeout(tick, speed());
	};

	const begin = (value: string) => {
		clearTimer();
		full = value;
		index = 0;
		setOutput("");
		if (full.length === 0) {
			setDone(true);
			return;
		}
		setDone(false);
		timer = setTimeout(tick, (options?.startDelay ?? 0) + speed());
	};

	createEffect(() => {
		begin(resolve(text) ?? "");
		onCleanup(clearTimer);
	});

	return {
		output,
		done,
		restart: () => begin(full),
		pause: clearTimer,
		resume: () => {
			if (!done() && timer === undefined) timer = setTimeout(tick, speed());
		},
	};
}
