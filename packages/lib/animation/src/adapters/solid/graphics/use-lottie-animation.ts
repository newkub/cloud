/**
 * SolidJS composable for Lottie Animation
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createLottieAnimation } from "../../../modules/animation/application/usecases/graphics";
import type { LottieInstance, LottieOptions } from "../../../modules/animation/types";

export function useLottieAnimation(options: LottieOptions) {
	const [_lottieAnimation, setLottieAnimation] = createSignal<ReturnType<typeof createLottieAnimation> | null>(null);
	const [instance, setInstance] = createSignal<LottieInstance | null>(null);

	const createLottieInstance = () => {
		const la = createLottieAnimation(options);
		setLottieAnimation(la);
		setInstance(la.getInstance());
		return la;
	};

	const play = () => {
		const inst = instance();
		if (inst) {
			inst.play();
		}
	};

	const pause = () => {
		const inst = instance();
		if (inst) {
			inst.pause();
		}
	};

	const stop = () => {
		const inst = instance();
		if (inst) {
			inst.stop();
		}
	};

	const setSpeed = (speed: number) => {
		const inst = instance();
		if (inst) {
			inst.setSpeed(speed);
		}
	};

	const setDirection = (direction: number) => {
		const inst = instance();
		if (inst) {
			inst.setDirection(direction);
		}
	};

	const goToAndPlay = (frame: number) => {
		const inst = instance();
		if (inst) {
			inst.goToAndPlay(frame);
		}
	};

	const goToAndStop = (frame: number) => {
		const inst = instance();
		if (inst) {
			inst.goToAndStop(frame);
		}
	};

	// Auto-create instance on mount
	createEffect(() => {
		createLottieInstance();
		onCleanup(() => {
			const inst = instance();
			if (inst) {
				inst.destroy();
			}
		});
	});

	return {
		play,
		pause,
		stop,
		setSpeed,
		setDirection,
		goToAndPlay,
		goToAndStop,
		instance,
	};
}
