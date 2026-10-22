/**
 * Animation Entity - Core animation model with properties and state
 * Refactored to use pure functions and immutable data structures
 */

export type AnimationTarget = string | Element | object;

export type AnimationDirection = "normal" | "reverse" | "alternate";

export type AnimationFill = "forwards" | "backwards" | "both" | "none";

export interface AnimationProperties {
	readonly x?: number;
	readonly y?: number;
	readonly rotate?: number | string;
	readonly scale?: number;
	readonly opacity?: number;
	readonly backgroundColor?: string;
	readonly color?: string;
	readonly width?: number | string;
	readonly height?: number | string;
	readonly [key: string]: unknown;
}

export interface AnimationOptions {
	readonly duration?: number;
	readonly delay?: number;
	readonly easing?: string;
	readonly direction?: AnimationDirection;
	readonly iterations?: number;
	readonly fill?: AnimationFill;
}

export interface AnimationState {
	readonly isPlaying: boolean;
	readonly isPaused: boolean;
	readonly isFinished: boolean;
	readonly progress: number;
	readonly currentTime: number;
}

export interface Animation {
	readonly id: string;
	readonly target: AnimationTarget;
	readonly properties: AnimationProperties;
	readonly options: AnimationOptions;
	readonly state: AnimationState;
}

const defaultOptions: AnimationOptions = {
	duration: 1000,
	delay: 0,
	easing: "easeOutQuad",
	direction: "normal",
	iterations: 1,
	fill: "forwards",
};

const defaultState: AnimationState = {
	isPlaying: false,
	isPaused: false,
	isFinished: false,
	progress: 0,
	currentTime: 0,
};

/**
 * Create a new animation instance
 */
export const createAnimation = (
	id: string,
	target: AnimationTarget,
	properties: AnimationProperties,
	options: AnimationOptions = {},
): Animation => ({
	id,
	target,
	properties,
	options: { ...defaultOptions, ...options },
	state: { ...defaultState },
});

/**
 * Update animation state immutably
 */
export const updateAnimationState = (animation: Animation, newState: Partial<AnimationState>): Animation => ({
	...animation,
	state: { ...animation.state, ...newState },
});

/**
 * Clone an animation with a new ID
 */
export const cloneAnimation = (animation: Animation, newId: string): Animation => ({
	...animation,
	id: newId,
});
