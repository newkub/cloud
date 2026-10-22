/**
 * Use case: Spring Animation
 * Creates and manages physics-based spring animations
 */

import { SpringAnimation } from "../../../domain/models/core/index";
import type { SpringOptions, SpringState } from "../../../types/index";

export function createSpringAnimation(options: SpringOptions = {}) {
	const springAnimation = new SpringAnimation(options);

	return {
		animateTo: (targetValue: number) => {
			springAnimation.animateTo(targetValue);
		},
		getState: (): SpringState => {
			return springAnimation.getState();
		},
		setCurrentValue: (value: number) => {
			springAnimation.setCurrentValue(value);
		},
		setVelocity: (velocity: number) => {
			springAnimation.setVelocity(velocity);
		},
		stop: () => {
			springAnimation.stop();
		},
		dispose: () => {
			springAnimation.dispose();
		},
	};
}
