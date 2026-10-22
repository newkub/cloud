/**
 * Timeline Entity - Manages multiple animations in sequence
 * Refactored to use pure functions and immutable data structures
 */

import type { Animation } from "./animation";

export interface TimelineOptions {
	readonly duration?: number;
	readonly delay?: number;
	readonly direction?: "normal" | "reverse" | "alternate";
	readonly iterations?: number;
}

export interface TimelineState {
	readonly isPlaying: boolean;
	readonly isPaused: boolean;
	readonly isFinished: boolean;
	readonly progress: number;
	readonly currentTime: number;
	readonly totalDuration: number;
}

export interface Timeline {
	readonly id: string;
	readonly animations: readonly Animation[];
	readonly options: TimelineOptions;
	readonly state: TimelineState;
}

const defaultOptions: TimelineOptions = {
	duration: 0,
	delay: 0,
	direction: "normal",
	iterations: 1,
};

const defaultState: TimelineState = {
	isPlaying: false,
	isPaused: false,
	isFinished: false,
	progress: 0,
	currentTime: 0,
	totalDuration: 0,
};

/**
 * Calculate total duration from animations
 */
const calculateTotalDuration = (animations: readonly Animation[]): number =>
	animations.reduce((total, anim) => total + (anim.options.duration || 0), 0);

/**
 * Create a new timeline instance
 */
export const createTimeline = (id: string, options: TimelineOptions = {}): Timeline => ({
	id,
	animations: [],
	options: { ...defaultOptions, ...options },
	state: { ...defaultState },
});

/**
 * Add animation to timeline
 */
export const addAnimation = (timeline: Timeline, animation: Animation): Timeline => {
	const newAnimations = [...timeline.animations, animation];
	const totalDuration = calculateTotalDuration(newAnimations);
	return {
		...timeline,
		animations: newAnimations,
		state: { ...timeline.state, totalDuration },
	};
};

/**
 * Remove animation from timeline
 */
export const removeAnimation = (timeline: Timeline, animationId: string): Timeline => {
	const newAnimations = timeline.animations.filter((a) => a.id !== animationId);
	const totalDuration = calculateTotalDuration(newAnimations);
	return {
		...timeline,
		animations: newAnimations,
		state: { ...timeline.state, totalDuration },
	};
};

/**
 * Update timeline state immutably
 */
export const updateTimelineState = (timeline: Timeline, newState: Partial<TimelineState>): Timeline => ({
	...timeline,
	state: { ...timeline.state, ...newState },
});
