import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface WritableAccessor<T> {
	(): T;
	/** Apply a new value to the media element and mirror it into the signal. */
	set: (value: T) => void;
}

export interface MediaControlsState {
	/** Media source URL — writable. */
	src: WritableAccessor<string>;
	/** Playhead in seconds — writable (seeking). */
	currentTime: WritableAccessor<number>;
	/** Output gain 0–1 — writable. */
	volume: WritableAccessor<number>;
	/** Mute flag — writable. */
	muted: WritableAccessor<boolean>;
	/** Playback rate — writable. */
	rate: WritableAccessor<number>;
	/** True while the element is playing. */
	playing: Accessor<boolean>;
	/** True after a `waiting` event until playback resumes. */
	awaiting: Accessor<boolean>;
	/** True while the element is seeking. */
	seeking: Accessor<boolean>;
	/** Media length in seconds (`0` while unknown). */
	duration: Accessor<number>;
}

/**
 * Reactive bindings for an `<audio>`/`<video>` element. Pass the element (or an
 * accessor that resolves to one) and the hook mirrors media events (`play`,
 * `pause`, `waiting`, `seeking`, `seeked`, `timeupdate`, `durationchange`,
 * `canplay`, `volumechange`, `ratechange`) into signals, re-subscribing when the
 * target changes. `src`/`currentTime`/`volume`/`muted`/`rate` are writable — a
 * `set()` writes through to the element immediately and updates the signal.
 *
 * @param target — Media element or accessor resolving to one.
 * @returns `{ src, currentTime, volume, muted, rate, playing, awaiting, seeking, duration }`
 *
 * @example
 * let video!: HTMLVideoElement;
 * const media = useMediaControls(() => video);
 * <video ref={video} src="/clip.mp4" />
 * <button onClick={() => media.volume.set(0.5)}>quiet</button>
 */
export function useMediaControls(target: MaybeAccessor<HTMLMediaElement | undefined>): MediaControlsState {
	const [src, setSrc] = createSignal("");
	const [currentTime, setCurrentTime] = createSignal(0);
	const [volume, setVolume] = createSignal(1);
	const [muted, setMuted] = createSignal(false);
	const [rate, setRate] = createSignal(1);
	const [playing, setPlaying] = createSignal(false);
	const [awaiting, setAwaiting] = createSignal(false);
	const [seeking, setSeeking] = createSignal(false);
	const [duration, setDuration] = createSignal(0);

	let el: HTMLMediaElement | undefined;

	const update = () => {
		if (!el) return;
		setSrc(el.currentSrc || el.src);
		setCurrentTime(el.currentTime);
		setVolume(el.volume);
		setMuted(el.muted);
		setRate(el.playbackRate);
		setPlaying(!el.paused);
		setSeeking(el.seeking);
		setDuration(Number.isFinite(el.duration) ? el.duration : 0);
	};

	createEffect(() => {
		const node = read(target);
		el = node;
		if (!node) {
			setPlaying(false);
			return;
		}
		const cleanups: Array<() => void> = [];
		const on = (type: string, handler: () => void) => {
			node.addEventListener(type, handler);
			cleanups.push(() => node.removeEventListener(type, handler));
		};
		const sync = () => update();
		for (const type of [
			"play",
			"pause",
			"timeupdate",
			"durationchange",
			"loadedmetadata",
			"seeking",
			"seeked",
			"volumechange",
			"ratechange",
		])
			on(type, sync);
		on("waiting", () => setAwaiting(true));
		on("playing", () => {
			setAwaiting(false);
			update();
		});
		on("canplay", () => setAwaiting(false));
		update();
		onCleanup(() => {
			for (const off of cleanups) off();
		});
	});

	const writable = <T>(get: Accessor<T>, setter: (value: T) => void): WritableAccessor<T> =>
		Object.assign(() => get(), { set: setter });

	return {
		src: writable(src, (value) => {
			if (el) el.src = value;
			setSrc(value);
		}),
		currentTime: writable(currentTime, (value) => {
			if (el) el.currentTime = value;
			setCurrentTime(value);
		}),
		volume: writable(volume, (value) => {
			const clamped = Math.min(1, Math.max(0, value));
			if (el) el.volume = clamped;
			setVolume(clamped);
		}),
		muted: writable(muted, (value) => {
			if (el) el.muted = value;
			setMuted(value);
		}),
		rate: writable(rate, (value) => {
			if (el) el.playbackRate = value;
			setRate(value);
		}),
		playing,
		awaiting,
		seeking,
		duration,
	};
}
