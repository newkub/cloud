// Solid adapter

// Animation adapters
export { createAnimationAdapter, createTimelineAdapter } from "./adapter-base";
// Database adapters - FP style
export {
	// Types
	type AnimationRepository,
	type AnimationRepositoryState,
	clearRepository,
	// Factory
	createAnimationRepository,
	// State management
	createRepositoryState,
	createRepositoryStateFrom,
	deleteAnimation,
	findAllAnimations,
	findAnimationById,
	findAnimationsByTarget,
	// Pure operations (FP style)
	saveAnimation,
	updateAnimation,
} from "./db/memory-repository";

export * from "./solid";
