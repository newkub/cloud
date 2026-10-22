/**
 * Use case: Lottie Animation
 * Creates and manages Lottie animations
 */

import { LottieAnimation } from "../../../domain/models/graphics/index";
import type { LottieInstance, LottieOptions } from "../../../types/index";

export function createLottieAnimation(options: LottieOptions) {
	const lottieAnimation = new LottieAnimation(options);

	return {
		getInstance: (): LottieInstance => {
			return lottieAnimation.getInstance();
		},
	};
}
