/**
 * Transitions Module - Main Entry Point
 *
 * File-based page transitions like Nuxt
 */

// Domain (pure operations)
export {
	buildCssTransition,
	createTransitionClassName,
	getEnterClasses,
	getLeaveClasses,
	getTransitionDirection,
	getTransitionEndTime,
	isSameTransition,
	mergeTransitionOptions,
} from "./domain";
// Ports (interfaces)
export type {
	TransitionHooksPort,
	TransitionServicePort,
	TransitionStatePort,
} from "./ports";
// Types (domain type aliases)
export type {
	PageTransition,
	TransitionHook,
	TransitionMode,
	TransitionOptions,
} from "./types";
