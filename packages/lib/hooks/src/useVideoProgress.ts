import { type Accessor, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface VideoProgressState {
	/** Playback position in seconds */
	currentTime: Accessor<number>;
	/** Total duration in seconds — `0` while metadata is unavailable (`NaN`/`Infinity`) */
	duration: Accessor<number>;
	/** `currentTime / duration * 100`, clamped to 0–100 — `0` without a duration */
	percent: Accessor<number>;
	/** End of the last buffered range in seconds */
	buffered: Accessor<number>;
	/** True between `play` and `pause`/`ended` */
	playing: Accessor<boolean>;
}

/**
 * Playback progress of a `<video>` element as signals — binds `timeupdate`,
 * `loadedmetadata`, `durationchange`, `progress`, `play`, `pause` and `ended`
 * to the resolved element. Reactive: rebinds when the element accessor
 * changes; listeners are removed on cleanup. Safe with `undefined` refs —
 * everything stays `0`/`false`.
 *
 * @param target — `<video>` element or an accessor resolving to one
 * @returns `{ currentTime, duration, percent, buffered, playing }`
 *
 * @example
 * let video!: HTMLVideoElement;
 * const vp = useVideoProgress(() => video);
 * <video ref={video} src="/clip.mp4" />
 * <progress value={vp.percent()} max={100} />
 */
export function useVideoProgress(target: MaybeAccessor<HTMLVideoElement | undefined>): VideoProgressState {
	const [currentTime, setCurrentTime] = createSignal(0);
	const [duration, setDuration] = createSignal(0);
	const [buffered, setBuffered] = createSignal(0);
	const [playing, setPlaying] = createSignal(false);
	const percent = createMemo(() => {
		const d = duration();
		return d > 0 ? Math.min(100, (currentTime() / d) * 100) : 0;
	});

	createEffect(() => {
		const el = resolve(target);
		if (!el) return;
		const onTime = () => setCurrentTime(el.currentTime);
		const onMeta = () => setDuration(Number.isFinite(el.duration) ? el.duration : 0);
		const onProgress = () => {
			const ranges = el.buffered;
			setBuffered(ranges.length ? ranges.end(ranges.length - 1) : 0);
		};
		const onPlay = () => setPlaying(true);
		const onPause = () => setPlaying(false);
		onTime();
		onMeta();
		onProgress();
		setPlaying(!el.paused && !el.ended);
		el.addEventListener("timeupdate", onTime);
		el.addEventListener("loadedmetadata", onMeta);
		el.addEventListener("durationchange", onMeta);
		el.addEventListener("progress", onProgress);
		el.addEventListener("play", onPlay);
		el.addEventListener("pause", onPause);
		el.addEventListener("ended", onPause);
		onCleanup(() => {
			el.removeEventListener("timeupdate", onTime);
			el.removeEventListener("loadedmetadata", onMeta);
			el.removeEventListener("durationchange", onMeta);
			el.removeEventListener("progress", onProgress);
			el.removeEventListener("play", onPlay);
			el.removeEventListener("pause", onPause);
			el.removeEventListener("ended", onPause);
		});
	});

	return { currentTime, duration, percent, buffered, playing };
}
