/**
 * Animation Chain Domain Model
 * Handles fluent API for chaining animations
 * Refactored to use pure functions and immutable data structures
 */

import type { AnimationParameters, AnimationTarget } from "../../../types";

export interface ChainStep {
	readonly type: "to" | "from" | "fromTo";
	readonly props: Record<string, unknown>;
	readonly fromProps?: Record<string, unknown>;
	readonly options?: AnimationParameters;
}

export interface AnimationChainState {
	readonly target: AnimationTarget;
	readonly steps: readonly ChainStep[];
	readonly currentStep: number;
	readonly isPlaying: boolean;
}

export interface AnimationChain {
	readonly state: AnimationChainState;
}

/**
 * Create a new animation chain
 */
export const createAnimationChain = (target: AnimationTarget): AnimationChain => ({
	state: {
		target,
		steps: [],
		currentStep: 0,
		isPlaying: false,
	},
});

/**
 * Add a 'to' step to the chain
 */
export const addToChain = (
	chain: AnimationChain,
	props: Record<string, unknown>,
	options?: AnimationParameters,
): AnimationChain => ({
	state: {
		...chain.state,
		steps: [...chain.state.steps, { type: "to" as const, props, options }],
	},
});

/**
 * Add a 'from' step to the chain
 */
export const addFromChain = (
	chain: AnimationChain,
	props: Record<string, unknown>,
	options?: AnimationParameters,
): AnimationChain => ({
	state: {
		...chain.state,
		steps: [...chain.state.steps, { type: "from" as const, props, options }],
	},
});

/**
 * Add a 'fromTo' step to the chain
 */
export const addFromToChain = (
	chain: AnimationChain,
	fromProps: Record<string, unknown>,
	toProps: Record<string, unknown>,
	options?: AnimationParameters,
): AnimationChain => ({
	state: {
		...chain.state,
		steps: [...chain.state.steps, { type: "fromTo" as const, props: toProps, fromProps, options }],
	},
});

/**
 * Start playing the chain
 */
export const playChain = (chain: AnimationChain): AnimationChain => ({
	state: {
		...chain.state,
		isPlaying: true,
		currentStep: 0,
	},
});

/**
 * Pause the chain
 */
export const pauseChain = (chain: AnimationChain): AnimationChain => ({
	state: {
		...chain.state,
		isPlaying: false,
	},
});

/**
 * Reverse the steps in the chain
 */
export const reverseChain = (chain: AnimationChain): AnimationChain => ({
	state: {
		...chain.state,
		steps: [...chain.state.steps].reverse(),
	},
});

/**
 * Restart the chain from the beginning
 */
export const restartChain = (chain: AnimationChain): AnimationChain => ({
	state: {
		...chain.state,
		isPlaying: true,
		currentStep: 0,
	},
});

/**
 * Cancel the chain and reset
 */
export const cancelChain = (chain: AnimationChain): AnimationChain => ({
	state: {
		...chain.state,
		isPlaying: false,
		currentStep: 0,
	},
});

/**
 * Get the steps from the chain
 */
export const getChainSteps = (chain: AnimationChain): readonly ChainStep[] => chain.state.steps;

/**
 * Calculate progress for a step based on elapsed time and duration
 */
export const calculateStepProgress = (elapsed: number, duration: number): number => Math.min(elapsed / duration, 1);

/**
 * Interpolate value between from and to based on progress
 */
export const interpolateValue = (from: number, to: number, progress: number): number => from + (to - from) * progress;

/**
 * Get next step index
 */
export const getNextStepIndex = (currentStep: number, totalSteps: number): number => (currentStep + 1) % totalSteps;
