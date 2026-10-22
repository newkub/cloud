/**
 * Animation Engine port
 * Interface for animation execution engines
 */

import type { Result } from "../../../shared/types";
import type {
	AnimationCallback,
	AnimationInstance,
	AnimationParameters,
	AnimationTarget,
	AnimationValue,
} from "../types";

export interface IAnimationEngine {
	/**
	 * Create and execute an animation
	 */
	create(
		targets: AnimationTarget,
		properties: Record<string, AnimationValue>,
		parameters?: AnimationParameters,
		callbacks?: AnimationCallback,
	): Promise<Result<AnimationInstance>>;

	/**
	 * Pause an animation
	 */
	pause(instance: AnimationInstance): Promise<Result<void>>;

	/**
	 * Resume a paused animation
	 */
	resume(instance: AnimationInstance): Promise<Result<void>>;

	/**
	 * Stop and clean up an animation
	 */
	stop(instance: AnimationInstance): Promise<Result<void>>;

	/**
	 * Check if engine is supported in current environment
	 */
	isSupported(): boolean;
}
