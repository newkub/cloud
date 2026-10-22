/**
 * Timeline Operations - Pure business logic functions for timeline management
 */

import type { TimelineOptions, TimelineState } from "../models/core/timeline";

/**
 * Calculate timeline progress based on current time
 */
export const calculateTimelineProgress = (currentTime: number, totalDuration: number, delay: number): number => {
	const adjustedTime = Math.max(0, currentTime - delay);
	return Math.min(1, adjustedTime / totalDuration);
};

/**
 * Calculate timeline state
 */
export const calculateTimelineState = (
	currentTime: number,
	animations: { options: { duration?: number } }[],
	options: TimelineOptions,
): TimelineState => {
	const totalDuration = animations.reduce((total, anim) => total + (anim.options.duration || 0), 0);

	const progress = calculateTimelineProgress(currentTime, totalDuration, options.delay || 0);
	const isFinished = progress >= 1;

	return {
		isPlaying: !isFinished && currentTime >= (options.delay || 0),
		isPaused: false,
		isFinished,
		progress,
		currentTime,
		totalDuration,
	};
};

/**
 * Calculate animation offset in timeline
 */
export const calculateAnimationOffset = (
	_animationIndex: number,
	previousAnimations: { options: { duration?: number } }[],
): number => {
	return previousAnimations.reduce((total, anim) => total + (anim.options.duration || 0), 0);
};

/**
 * Validate timeline options
 */
export const validateTimelineOptions = (options: TimelineOptions): boolean => {
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
