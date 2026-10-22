/**
 * In-memory animation repository implementation - Functional style
 * State is immutable, operations return new state
 */

import type { Animation } from "../../modules/animation/domain/models/core/animation";
import type { Result } from "../../shared/types";
import { err, ok } from "../../shared/types";

// Repository State
export type AnimationRepositoryState = Readonly<{
	animations: Map<string, Animation>;
}>;

export const createRepositoryState = (): AnimationRepositoryState => ({
	animations: new Map(),
});

export const createRepositoryStateFrom = (animations: Map<string, Animation>): AnimationRepositoryState => ({
	animations: new Map(animations),
});

// Repository Operations

export const saveAnimation = (
	state: AnimationRepositoryState,
	animation: Animation,
): { state: AnimationRepositoryState; result: Result<Animation, Error> } => {
	const newAnimations = new Map(state.animations);
	newAnimations.set(animation.id, animation);

	return {
		state: { animations: newAnimations },
		result: ok(animation),
	};
};

export const findAnimationById = (state: AnimationRepositoryState, id: string): Result<Animation | null, Error> => {
	const animation = state.animations.get(id) || null;
	return ok(animation);
};

export const findAllAnimations = (state: AnimationRepositoryState): Result<readonly Animation[], Error> => {
	const animations = Array.from(state.animations.values());
	return ok(animations);
};

export const updateAnimation = (
	state: AnimationRepositoryState,
	animation: Animation,
): { state: AnimationRepositoryState; result: Result<Animation, Error> } => {
	if (!state.animations.has(animation.id)) {
		return {
			state,
			result: err(new Error(`Animation with id ${animation.id} not found`)),
		};
	}

	const newAnimations = new Map(state.animations);
	newAnimations.set(animation.id, animation);

	return {
		state: { animations: newAnimations },
		result: ok(animation),
	};
};

export const deleteAnimation = (
	state: AnimationRepositoryState,
	id: string,
): { state: AnimationRepositoryState; result: Result<boolean, Error> } => {
	const existed = state.animations.has(id);
	const newAnimations = new Map(state.animations);
	newAnimations.delete(id);

	return {
		state: { animations: newAnimations },
		result: ok(existed),
	};
};

export const findAnimationsByTarget = (
	state: AnimationRepositoryState,
	target: string,
): Result<readonly Animation[], Error> => {
	const animations = Array.from(state.animations.values()).filter((animation) => {
		if (typeof animation.target === "string") {
			return animation.target === target;
		}
		// For Element or NodeList targets, we'd need more sophisticated matching
		return false;
	});
	return ok(animations);
};

export const clearRepository = (): AnimationRepositoryState => createRepositoryState();

// Legacy adapter for backward compatibility with async interface
// Returns the state management functions for dependency injection
export const createAnimationRepository = () => {
	let state = createRepositoryState();

	return {
		save: async (animation: Animation): Promise<Result<Animation, Error>> => {
			const result = saveAnimation(state, animation);
			state = result.state;
			return result.result;
		},
		findById: async (id: string): Promise<Result<Animation | null, Error>> => {
			return findAnimationById(state, id);
		},
		findAll: async (): Promise<Result<readonly Animation[], Error>> => {
			return findAllAnimations(state);
		},
		update: async (animation: Animation): Promise<Result<Animation, Error>> => {
			const result = updateAnimation(state, animation);
			state = result.state;
			return result.result;
		},
		delete: async (id: string): Promise<Result<boolean, Error>> => {
			const result = deleteAnimation(state, id);
			state = result.state;
			return result.result;
		},
		findByTarget: async (target: string): Promise<Result<readonly Animation[], Error>> => {
			return findAnimationsByTarget(state, target);
		},
		clear: (): void => {
			state = clearRepository();
		},
		// FP-style: expose state operations for functional composition
		getState: (): AnimationRepositoryState => state,
		setState: (newState: AnimationRepositoryState): void => {
			state = newState;
		},
	};
};

export type AnimationRepository = ReturnType<typeof createAnimationRepository>;
