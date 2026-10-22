import { createEffect, createSignal, onCleanup } from "solid-js";
import {
	type AnimationAdapterState,
	cleanupAnimation,
	createAnimationWithCallbacks,
} from "../../animation-adapter-base";
import type {
	AnimationCallback,
	AnimationInstance,
	AnimationParameters,
	AnimationTarget,
	AnimationValue,
} from "../../../modules/animation/types/index";

/**
 * SolidJS primitive for animations
 */
export function useAnimation(
	targets: AnimationTarget,
	properties: Record<string, AnimationValue>,
	parameters: AnimationParameters = {},
	callbacks: AnimationCallback = {},
) {
	const [animation, setAnimation] = createSignal<AnimationInstance | null>(null);
	const [isPlaying, setIsPlaying] = createSignal(false);
	const [progress, setProgress] = createSignal(0);

	const createAnimationInstance = () => {
		const anim = createAnimationWithCallbacks(
			targets,
			properties,
			parameters,
			callbacks,
			(state: Partial<AnimationAdapterState>) => {
				if (state.isPlaying !== undefined) setIsPlaying(state.isPlaying);
				if (state.progress !== undefined) setProgress(state.progress);
			},
		);

		setAnimation(anim);
		return anim;
	};

	const play = () => {
		const anim = animation();
		if (!anim) {
			return createAnimationInstance()?.play();
		}
		return anim.play();
	};

	const pause = () => {
		animation()?.pause();
		setIsPlaying(false);
	};

	const reverse = () => {
		animation()?.reverse();
	};

	const restart = () => {
		animation()?.restart();
	};

	const cancel = () => {
		cleanupAnimation(animation());
		setIsPlaying(false);
	};

	const seek = (time: number) => {
		animation()?.seek(time);
	};

	// Auto-create on mount if autoplay is true
	createEffect(() => {
		if (parameters.autoplay !== false) {
			createAnimationInstance();
		}
	});

	// Cleanup on unmount
	onCleanup(() => {
		cancel();
	});

	return {
		animation,
		isPlaying,
		progress,
		play,
		pause,
		reverse,
		restart,
		cancel,
		seek,
	};
}
