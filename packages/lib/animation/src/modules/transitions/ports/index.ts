// Transitions Module - Ports/Interfaces

import type { PageTransition, TransitionHook, TransitionOptions } from "../domain/models";

/**
 * Transition Service Port - Interface for transition management
 */
export interface TransitionServicePort {
	/**
	 * Register a page transition
	 */
	registerTransition(name: string, options: TransitionOptions): PageTransition;

	/**
	 * Get a registered transition by name
	 */
	getTransition(name: string): PageTransition | undefined;

	/**
	 * List all registered transitions
	 */
	getAllTransitions(): PageTransition[];

	/**
	 * Set the active transition
	 */
	setActiveTransition(name: string): void;

	/**
	 * Get the active transition
	 */
	getActiveTransition(): PageTransition | null;

	/**
	 * Remove a transition registration
	 */
	removeTransition(name: string): boolean;
}

/**
 * Transition Hooks Port - Interface for transition lifecycle
 */
export interface TransitionHooksPort {
	/**
	 * Called before a transition starts
	 */
	onBeforeLeave?: TransitionHook;

	/**
	 * Called after a transition finishes
	 */
	onAfterEnter?: TransitionHook;

	/**
	 * Called when a transition is cancelled
	 */
	onTransitionCancelled?: TransitionHook;
}

/**
 * Transition State Port - Interface for state management
 */
export interface TransitionStatePort {
	/**
	 * Current transition state
	 */
	getState(): {
		isTransitioning: boolean;
		currentTransition: string | null;
		from: string | null;
		to: string | null;
	};

	/**
	 * Start a transition
	 */
	startTransition(name: string, from: string, to: string): void;

	/**
	 * End the current transition
	 */
	endTransition(): void;

	/**
	 * Cancel the current transition
	 */
	cancelTransition(): void;
}
