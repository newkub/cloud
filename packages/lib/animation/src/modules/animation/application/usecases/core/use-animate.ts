import { createAnimationAdapter } from "../../../../../adapters/index";
import type {
	AnimationCallback,
	AnimationInstance,
	AnimationParameters,
	AnimationTarget,
	AnimationValue,
} from "../../../types/index";

/**
 * Use case: Animate properties on targets
 */
export function createAnimate() {
	return function animate(
		targets: AnimationTarget,
		properties: Record<string, AnimationValue>,
		parameters: AnimationParameters = {},
		callbacks: AnimationCallback = {},
	): AnimationInstance {
		return createAnimationAdapter(targets, properties, parameters, callbacks);
	};
}
