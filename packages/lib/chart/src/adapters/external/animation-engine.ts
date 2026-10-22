/**
 * Animation engine for managing animations
 * Clean Architecture: Infrastructure layer - Animation engine
 */

import type { EasingFunction } from "./easings";

// Animation state
export interface AnimationState {
	readonly id: string;
	readonly from: number;
	readonly to: number;
	readonly duration: number;
	readonly easing: EasingFunction;
	readonly startTime: number | null;
	readonly currentTime: number;
	readonly running: boolean;
	readonly onUpdate: (value: number) => void;
	readonly onComplete?: () => void;
}

export const createAnimationState = (
	id: string,
	from: number,
	to: number,
	duration: number,
	easing: EasingFunction,
	onUpdate: (value: number) => void,
	onComplete?: () => void,
): AnimationState => ({
	id,
	from,
	to,
	duration,
	easing,
	onUpdate,
	...(onComplete !== undefined && { onComplete }),
	startTime: null,
	currentTime: 0,
	running: false,
});

export const startAnimation = (state: AnimationState): AnimationState => ({
	...state,
	startTime: performance.now(),
	running: true,
});

export const stopAnimation = (state: AnimationState): AnimationState => ({
	...state,
	running: false,
});

export const updateAnimation = (state: AnimationState): AnimationState => {
	if (!state.startTime || !state.running) return state;

	const elapsed = performance.now() - state.startTime;
	const currentTime = Math.min(elapsed, state.duration);

	const progress = currentTime / state.duration;
	const easedProgress = state.easing(progress);
	const value = state.from + (state.to - state.from) * easedProgress;

	state.onUpdate(value);

	if (currentTime >= state.duration) {
		state.onComplete?.();
		return { ...state, currentTime, running: false };
	}

	return { ...state, currentTime };
};

// Animation engine state
export interface AnimationEngineState {
	readonly animations: Map<string, AnimationState>;
	readonly rafId: number | null;
}

export const createAnimationEngineState = (): AnimationEngineState => ({
	animations: new Map(),
	rafId: null,
});

export const addAnimation = (
	state: AnimationEngineState,
	id: string,
	from: number,
	to: number,
	duration: number,
	easing: EasingFunction,
	onUpdate: (value: number) => void,
	onComplete?: () => void,
): AnimationEngineState => {
	const animation = createAnimationState(id, from, to, duration, easing, onUpdate, onComplete);
	const startedAnimation = startAnimation(animation);
	const newAnimations = new Map(state.animations);
	newAnimations.set(id, startedAnimation);

	return {
		...state,
		animations: newAnimations,
		rafId: state.rafId ?? requestAnimationFrame(() => {}),
	};
};

export const removeAnimation = (state: AnimationEngineState, id: string): AnimationEngineState => {
	const newAnimations = new Map(state.animations);
	newAnimations.delete(id);

	return {
		...state,
		animations: newAnimations,
		rafId: newAnimations.size === 0 ? null : state.rafId,
	};
};

export const clearAllAnimations = (state: AnimationEngineState): AnimationEngineState => ({
	...state,
	animations: new Map(),
	rafId: null,
});

export const tickAnimations = (state: AnimationEngineState): AnimationEngineState => {
	let hasRunningAnimations = false;
	const newAnimations = new Map(state.animations);

	for (const [id, animation] of newAnimations) {
		if (animation.running) {
			const updated = updateAnimation(animation);
			newAnimations.set(id, updated);
			if (updated.running) hasRunningAnimations = true;
		}
	}

	return {
		...state,
		animations: newAnimations,
		rafId: hasRunningAnimations ? requestAnimationFrame(() => {}) : null,
	};
};
