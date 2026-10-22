/**
 * Animation Operations - Pure business logic functions for animation calculations
 */

import { clamp, lerp } from "../../../../shared/utils";
import type { AnimationOptions, AnimationProperties, AnimationState } from "../models/core/animation";

/**
 * Calculate animation progress based on time and duration
 */
export const calculateProgress = (currentTime: number, duration: number, delay: number): number => {
	const adjustedTime = Math.max(0, currentTime - delay);
	return clamp(0, 1)(adjustedTime / duration);
};

/**
 * Apply easing to progress value
 */
export const applyEasing = (progress: number, easingFn: (t: number) => number): number => {
	return clamp(0, 1)(easingFn(progress));
};

/**
 * Interpolate animation properties based on progress
 */
export const interpolateProperties = (
	from: AnimationProperties,
	to: AnimationProperties,
	progress: number,
): AnimationProperties => {
	const result: Record<string, unknown> = {};

	for (const key in to) {
		const fromValue = from[key] as number | undefined;
		const toValue = to[key] as number | string | undefined;

		if (typeof fromValue === "number" && typeof toValue === "number") {
			result[key] = lerp(fromValue, toValue, progress);
		} else {
			result[key] = toValue;
		}
	}

	return result as AnimationProperties;
};

/**
 * Calculate current animation state
 */
export const calculateAnimationState = (currentTime: number, options: AnimationOptions): AnimationState => {
	const progress = calculateProgress(currentTime, options.duration || 1000, options.delay || 0);
	const isFinished = progress >= 1;

	return {
		isPlaying: !isFinished && currentTime >= (options.delay || 0),
		isPaused: false,
		isFinished,
		progress,
		currentTime,
	};
};

/**
 * Validate animation properties
 */
export const validateAnimationProperties = (properties: AnimationProperties): boolean => {
	if (properties.opacity !== undefined) {
		if (typeof properties.opacity !== "number" || properties.opacity < 0 || properties.opacity > 1) {
			return false;
		}
	}

	if (properties.scale !== undefined) {
		if (typeof properties.scale !== "number" || properties.scale < 0) {
			return false;
		}
	}

	return true;
};

/**
 * Validate animation options
 */
export const validateAnimationOptions = (options: AnimationOptions): boolean => {
	if (options.duration !== undefined && options.duration < 0) {
		return false;
	}

	if (options.delay !== undefined && options.delay < 0) {
		return false;
	}

	if (options.iterations !== undefined && options.iterations < 0) {
		return false;
	}

	return true;
};

/**
 * Calculate total duration with iterations
 */
export const calculateTotalDuration = (duration: number, iterations: number): number => {
	if (iterations === 0) return 0;
	return duration * iterations;
};
