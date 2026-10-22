/**
 * SolidJS composable for Timeline Editor
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createTimelineEditor } from "../../../modules/animation/application/usecases/advanced";
import type { Keyframe, TimelineEditorOptions, TimelineTrack } from "../../../modules/animation/types";

export function useTimelineEditor(options: TimelineEditorOptions = {}) {
	const [editor, setEditor] = createSignal<ReturnType<typeof createTimelineEditor> | null>(null);
	const [currentTime, setCurrentTime] = createSignal(0);
	const [duration, setDuration] = createSignal(0);
	const [isPlaying, setIsPlaying] = createSignal(false);
	const [tracks, setTracks] = createSignal<TimelineTrack[]>([]);

	const createEditorInstance = () => {
		const e = createTimelineEditor(options);
		setEditor(e);
		setCurrentTime(e.getCurrentTime());
		setDuration(e.getDuration());
		setTracks(e.getTracks());
		return e;
	};

	/** Run a mutation on the editor, then resync tracks/duration signals. */
	const mutate = (fn: (e: ReturnType<typeof createTimelineEditor>) => void, create = false) => {
		const e = editor() ?? (create ? createEditorInstance() : null);
		if (!e) return;
		fn(e);
		setTracks(e.getTracks());
		setDuration(e.getDuration());
	};

	const addTrack = (track: TimelineTrack) => mutate((e) => e.addTrack(track), true);
	const removeTrack = (trackId: string) => mutate((e) => e.removeTrack(trackId));
	const addKeyframe = (trackId: string, keyframe: Keyframe) => mutate((e) => e.addKeyframe(trackId, keyframe));
	const removeKeyframe = (trackId: string, keyframeIndex: number) =>
		mutate((e) => e.removeKeyframe(trackId, keyframeIndex));
	const updateKeyframe = (trackId: string, keyframeIndex: number, keyframe: Partial<Keyframe>) =>
		mutate((e) => e.updateKeyframe(trackId, keyframeIndex, keyframe));

	const setCurrentTimeHandler = (time: number) => {
		const e = editor();
		if (e) {
			e.setCurrentTime(time);
			setCurrentTime(e.getCurrentTime());
		}
	};

	const play = () => {
		const e = editor();
		if (e) {
			e.play();
			setIsPlaying(true);
		}
	};

	const pause = () => {
		const e = editor();
		if (e) {
			e.pause();
			setIsPlaying(false);
		}
	};

	const stop = () => {
		const e = editor();
		if (e) {
			e.stop();
			setIsPlaying(false);
			setCurrentTime(0);
		}
	};

	// Auto-update current time while playing
	createEffect(() => {
		if (isPlaying()) {
			const interval = setInterval(() => {
				const e = editor();
				if (e) {
					setCurrentTime(e.getCurrentTime());
					if (e.getCurrentTime() >= e.getDuration()) {
						setIsPlaying(false);
					}
				}
			}, 16); // ~60fps

			onCleanup(() => {
				clearInterval(interval);
			});
		}
	});

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createEditorInstance();
		onCleanup(() => {
			instance?.dispose();
		});
	});

	return {
		addTrack,
		removeTrack,
		addKeyframe,
		removeKeyframe,
		updateKeyframe,
		currentTime,
		setCurrentTime: setCurrentTimeHandler,
		duration,
		tracks,
		play,
		pause,
		stop,
		isPlaying,
		editor,
	};
}
