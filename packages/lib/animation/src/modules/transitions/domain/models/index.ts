// Transitions Module - Domain Models - Public API
// Clean Architecture: All domain types live in domain/models

export { DEFAULT_TRANSITION, TRANSITION_CLASSES } from "./constants";
export { createTransitionConfig, createTransitionState } from "./factories";
export type {
	PageTransition,
	TransitionConfig,
	TransitionHook,
	TransitionMode,
	TransitionOptions,
	TransitionState,
	TransitionStateInternal,
} from "./types";
