/**
 * SolidJS composable for 3D Transform Animation
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createTransform3D } from "../../../modules/animation/application/usecases/graphics";
import type { AnimationTarget, Transform3D, Transform3DOptions } from "../../../modules/animation/types";

export function useTransform3D(target: AnimationTarget, transforms: Transform3D, options?: Transform3DOptions) {
	const [transform3D, setTransform3D] = createSignal<ReturnType<typeof createTransform3D> | null>(null);
	const [isPlaying, setIsPlaying] = createSignal(false);
	const [progress, setProgress] = createSignal(0);

	const createTransform3DInstance = (
		randomUUID: () => string = (randomUUID: () => string = () => crypto.randomUUID()) => randomUUID(),
	) => {
		const t3d = createTransform3D(target, transforms, options, options?.id ?? randomUUID());

		// Override progress tracking
		const originalSeek = t3d.seek.bind(t3d);
		t3d.seek = (p: number) => {
			originalSeek(p);
			setProgress(p);
			return t3d;
		};

		setTransform3D(t3d);
		return t3d;
	};

	const play = () => {
		const t3d = transform3D();
		if (!t3d) {
			return createTransform3DInstance()?.play();
		}
		t3d.play();
		setIsPlaying(true);
	};

	const pause = () => {
		const t3d = transform3D();
		if (t3d) {
			t3d.pause();
			setIsPlaying(false);
		}
	};

	const reverse = () => {
		const t3d = transform3D();
		if (t3d) {
			const currentProgress = t3d.progress;
			t3d.seek(1 - currentProgress);
		}
	};

	const restart = () => {
		const t3d = transform3D();
		if (t3d) {
			t3d.cancel();
			t3d.play();
			setIsPlaying(true);
			setProgress(0);
		}
	};

	const cancel = () => {
		const t3d = transform3D();
		if (t3d) {
			t3d.cancel();
			setIsPlaying(false);
			setProgress(0);
		}
	};

	const seek = (p: number) => {
		const t3d = transform3D();
		if (t3d) {
			t3d.seek(p);
		}
	};

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createTransform3DInstance();
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
		isPlaying,
		progress,
		transform3D,
	};
}
