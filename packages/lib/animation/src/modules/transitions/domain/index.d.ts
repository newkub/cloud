import type { TransitionMode, TransitionOptions } from "./models";
/**
 * Merge user options with defaults
 */
export declare function mergeTransitionOptions(options?: TransitionOptions): Required<TransitionOptions>;
/**
 * Generate CSS classes for enter transition
 */
export declare function getEnterClasses(options: Required<TransitionOptions>): string[];
/**
 * Generate CSS classes for leave transition
 */
export declare function getLeaveClasses(options: Required<TransitionOptions>): string[];
/**
 * Calculate transition end time based on duration
 */
export declare function getTransitionEndTime(duration: number): number;
/**
 * Build CSS transition string
 */
export declare function buildCssTransition(options: Required<TransitionOptions>): string;
/**
 * Check if two transition configurations are equivalent
 */
export declare function isSameTransition(a: {
    mode: TransitionMode;
    duration: number;
}, b: {
    mode: TransitionMode;
    duration: number;
}): boolean;
/**
 * Get transition mode direction (for slide modes)
 */
export declare function getTransitionDirection(mode: TransitionMode, isForward: boolean): "left" | "right" | "none";
/**
 * Create a Transition class name based on mode and position
 */
export declare function createTransitionClassName(mode: TransitionMode, type: "enter" | "leave", position: "start" | "end"): string;
