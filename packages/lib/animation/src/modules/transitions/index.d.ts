/**
 * Transitions Module - Main Entry Point
 *
 * File-based page transitions like Nuxt
 */
export { buildCssTransition, createTransitionClassName, getEnterClasses, getLeaveClasses, getTransitionDirection, getTransitionEndTime, isSameTransition, mergeTransitionOptions, } from "./domain";
export type { TransitionHooksPort, TransitionServicePort, TransitionStatePort, } from "./ports";
export type { PageTransition, TransitionHook, TransitionMode, TransitionOptions, } from "./types";
