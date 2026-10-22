// Transition Domain - Pure business logic

import type { TransitionMode, TransitionOptions } from "./models";
import { DEFAULT_TRANSITION } from "./models";

/**
 * Merge user options with defaults
 */
export function mergeTransitionOptions(options?: TransitionOptions): Required<TransitionOptions> {
	return {
		...DEFAULT_TRANSITION,
		...options,
	};
}

/**
 * Generate CSS classes for enter transition
 */
export function getEnterClasses(options: Required<TransitionOptions>): string[] {
	const classes: string[] = [];

	if (options.css) {
		classes.push(options.enterClass);
		classes.push(options.enterActiveClass);

		if (options.enterToClass) {
			classes.push(options.enterToClass);
		}
	}

	return classes;
}

/**
 * Generate CSS classes for leave transition
 */
export function getLeaveClasses(options: Required<TransitionOptions>): string[] {
	const classes: string[] = [];

	if (options.css) {
		classes.push(options.leaveClass);
		classes.push(options.leaveActiveClass);

		if (options.leaveToClass) {
			classes.push(options.leaveToClass);
		}
	}

	return classes;
}

/**
 * Calculate transition end time based on duration
 */
export function getTransitionEndTime(duration: number): number {
	// Add small buffer for transition animation completion
	return duration + 50;
}

/**
 * Build CSS transition string
 */
export function buildCssTransition(options: Required<TransitionOptions>): string {
	return `all ${options.duration}ms ${options.easing}`;
}

/**
 * Check if two transition configurations are equivalent
 */
export function isSameTransition(
	a: { mode: TransitionMode; duration: number },
	b: { mode: TransitionMode; duration: number },
): boolean {
	return a.mode === b.mode && a.duration === b.duration;
}

/**
 * Get transition mode direction (for slide modes)
 */
export function getTransitionDirection(mode: TransitionMode, isForward: boolean): "left" | "right" | "none" {
	switch (mode) {
		case "slide":
			return isForward ? "left" : "right";
		default:
			return "none";
	}
}

/**
 * Create a Transition class name based on mode and position
 */
export function createTransitionClassName(
	mode: TransitionMode,
	type: "enter" | "leave",
	position: "start" | "end",
): string {
	const prefix = type === "enter" ? "enter" : "leave";
	const suffix = position === "start" ? "start" : "end";

	if (mode === "none") {
		return "";
	}

	return `${prefix}-${suffix}`;
}
