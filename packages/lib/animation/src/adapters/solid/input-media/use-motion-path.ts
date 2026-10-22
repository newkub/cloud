/**
 * SolidJS composable for Motion Path Animation
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createMotionPath } from "../../../modules/animation/application/usecases/input-media/use-motion-path";
import type { AnimationTarget, MotionPathOptions } from "../../../modules/animation/types";

export function useMotionPath(target: AnimationTarget, options: MotionPathOptions) {
	const [motionPath, setMotionPath] = createSignal<ReturnType<typeof createMotionPath> | null>(null);
	const [isPlaying, setIsPlaying] = createSignal(false);
	const [progress, setProgress] = createSignal(0);

	const createMotionPathInstance = (
		randomUUID: () => string = (randomUUID: () => string = () => crypto.randomUUID()) => randomUUID(),
	) => {
		const mp = createMotionPath(target, options, options.id ?? randomUUID());

		// Override progress tracking
		const originalSeek = mp.seek.bind(mp);
		mp.seek = (p: number) => {
			originalSeek(p);
			setProgress(p);
			return mp;
		};

		setMotionPath(mp);
		return mp;
	};

	const play = () => {
		const mp = motionPath();
		if (!mp) {
			return createMotionPathInstance()?.play();
		}
		mp.play();
		setIsPlaying(true);
	};

	const pause = () => {
		const mp = motionPath();
		if (mp) {
			mp.pause();
			setIsPlaying(false);
		}
	};

	const reverse = () => {
		const mp = motionPath();
		if (mp) {
			const currentProgress = mp.progress;
			mp.seek(1 - currentProgress);
		}
	};

	const restart = () => {
		const mp = motionPath();
		if (mp) {
			mp.cancel();
			mp.play();
			setIsPlaying(true);
			setProgress(0);
		}
	};

	const cancel = () => {
		const mp = motionPath();
		if (mp) {
			mp.cancel();
			setIsPlaying(false);
			setProgress(0);
		}
	};

	const seek = (p: number) => {
		const mp = motionPath();
		if (mp) {
			mp.seek(p);
		}
	};

	const getPointAtProgress = (p: number) => {
		const mp = motionPath();
		if (mp) {
			return mp.getPointAtProgress(p);
		}
		return { x: 0, y: 0 };
	};

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createMotionPathInstance();
		onCleanup(() => {
			instance?.cancel();
		});
	});

	return {
		play,
		pause,
		reverse,
		restart,
		cancel,
		seek,
		getPointAtProgress,
		isPlaying,
		progress,
		motionPath,
	};
}
