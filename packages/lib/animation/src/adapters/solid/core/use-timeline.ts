import { createSignal, onCleanup } from "solid-js";
import { createTimelineAdapter } from "../../adapter-base";
import type { AnimationInstance, TimelineInstance, TimelineOptions } from "../../../modules/animation/types/index";

export function useTimeline(options?: TimelineOptions) {
	const [timeline, setTimeline] = createSignal<TimelineInstance | null>(null);
	const [isPlaying, setIsPlaying] = createSignal(false);
	const [progress, setProgress] = createSignal(0);

	const createTimelineInstance = () => {
		const tl = createTimelineAdapter(options);

		const originalSeek = tl.seek.bind(tl);
		tl.seek = (time: number): TimelineInstance => {
			originalSeek(time);
			setProgress(tl.progress);
			return tl;
		};

		setTimeline(tl);
		return tl;
	};

	const play = () => {
		const tl = timeline();
		if (!tl) {
			return createTimelineInstance()?.play();
		}
		tl.play();
		setIsPlaying(true);
	};

	const pause = () => {
		timeline()?.pause();
		setIsPlaying(false);
	};

	const add = (anim: AnimationInstance, time?: number) => {
		const tl = timeline();
		if (!tl) {
			createTimelineInstance();
		}
		timeline()?.add(anim, time);
	};

	const restart = () => {
		timeline()?.restart();
	};

	const cancel = () => {
		timeline()?.cancel();
		setIsPlaying(false);
	};

	const seek = (time: number) => {
		timeline()?.seek(time);
	};

	// Cleanup on unmount
	onCleanup(() => {
		cancel();
	});

	return {
		timeline,
		isPlaying,
		progress,
		play,
		pause,
		add,
		restart,
		cancel,
		seek,
	};
}
