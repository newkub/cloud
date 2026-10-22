import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface MediaControls {
	/** True while the element is playing */
	playing: Accessor<boolean>;
	/** Playhead position in seconds */
	currentTime: Accessor<number>;
	/** Media length in seconds — 0 while unknown */
	duration: Accessor<number>;
	/** Output gain 0–1 */
	volume: Accessor<number>;
	/** True once playback reached the end */
	ended: Accessor<boolean>;
	play: () => Promise<void>;
	pause: () => void;
	/** Jump the playhead to `time` seconds */
	seek: (time: number) => void;
	/** Set gain, clamped to 0–1 */
	setVolume: (v: number) => void;
}

/**
 * Shared core for `useAudio`/`useVideo` — mirrors element playback events
 * (play, pause, timeupdate, durationchange, volumechange, ended…) into signals.
 * Not exported from the package barrel; internal to the media hooks.
 */
export function createMediaControls(el: Accessor<HTMLMediaElement | undefined>): MediaControls {
	const [playing, setPlaying] = createSignal(false);
	const [currentTime, setCurrentTime] = createSignal(0);
	const [duration, setDuration] = createSignal(0);
	const [volume, setVolume] = createSignal(1);
	const [ended, setEnded] = createSignal(false);

	createEffect(() => {
		const target = el();
		if (!target) return;
		const sync = () => {
			setPlaying(!target.paused && !target.ended);
			setCurrentTime(target.currentTime);
			setDuration(Number.isFinite(target.duration) ? target.duration : 0);
			setVolume(target.volume);
			setEnded(target.ended);
		};
		sync();
		const EVENTS = ["play", "pause", "timeupdate", "durationchange", "loadedmetadata", "volumechange", "ended"];
		for (const type of EVENTS) target.addEventListener(type, sync);
		onCleanup(() => {
			for (const type of EVENTS) target.removeEventListener(type, sync);
		});
	});

	return {
		playing,
		currentTime,
		duration,
		volume,
		ended,
		play: async () => {
			await el()?.play();
		},
		pause: () => el()?.pause(),
		seek: (time) => {
			const target = el();
			if (!target) return;
			target.currentTime = time;
			setCurrentTime(time);
			setEnded(false);
		},
		setVolume: (v) => {
			const target = el();
			if (target) target.volume = Math.min(1, Math.max(0, v));
		},
	};
}

/**
 * Audio playback controls. Pass a source (string or accessor) and the hook
 * owns an `<audio>` element — or pass an element accessor (`() => el`) to
 * control markup you render yourself.
 *
 * @param source — Media URL (`string`/`Accessor<string>`) or `Accessor<HTMLAudioElement | undefined>`
 * @returns `{ playing, currentTime, duration, volume, ended, play, pause, seek, setVolume }`
 *
 * @example
 * const audio = useAudio("/beep.wav");
 * <button onClick={() => (audio.playing() ? audio.pause() : audio.play())}>toggle</button>
 *
 * // control your own element:
 * let el!: HTMLAudioElement;
 * const audio = useAudio(() => el);
 * <audio ref={el} src="/beep.wav" />
 */
export function useAudio(source: MaybeAccessor<string | HTMLAudioElement | undefined>): MediaControls {
	const [el, setEl] = createSignal<HTMLAudioElement>();
	let owned: HTMLAudioElement | undefined;

	createEffect(() => {
		const v = resolve(source);
		if (typeof v === "string") {
			owned ??= typeof Audio === "undefined" ? undefined : new Audio();
			if (!owned) return;
			owned.preload = "auto";
			if (owned.getAttribute("src") !== v) owned.src = v;
			setEl(owned);
		} else if (v instanceof HTMLAudioElement) {
			setEl(v);
		}
	});

	onCleanup(() => {
		owned?.pause();
		owned?.removeAttribute("src");
	});

	return createMediaControls(el);
}
