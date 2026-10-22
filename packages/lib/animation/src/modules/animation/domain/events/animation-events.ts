/**
 * Animation Domain Events - Event types for animation lifecycle
 */

export type AnimationEventType =
	| "AnimationStarted"
	| "AnimationPaused"
	| "AnimationResumed"
	| "AnimationCompleted"
	| "AnimationCancelled"
	| "AnimationLooped";

export interface AnimationEvent {
	readonly type: AnimationEventType;
	readonly animationId: string;
	readonly timestamp: number;
	readonly data?: Record<string, unknown>;
}

export interface AnimationStartedEvent extends AnimationEvent {
	readonly type: "AnimationStarted";
	readonly data: {
		readonly duration: number;
		readonly delay: number;
	};
}

export interface AnimationPausedEvent extends AnimationEvent {
	readonly type: "AnimationPaused";
	readonly data: {
		readonly progress: number;
		readonly currentTime: number;
	};
}

export interface AnimationResumedEvent extends AnimationEvent {
	readonly type: "AnimationResumed";
	readonly data: {
		readonly progress: number;
		readonly currentTime: number;
	};
}

export interface AnimationCompletedEvent extends AnimationEvent {
	readonly type: "AnimationCompleted";
	readonly data: {
		readonly duration: number;
		readonly iterations: number;
	};
}

export interface AnimationCancelledEvent extends AnimationEvent {
	readonly type: "AnimationCancelled";
	readonly data: {
		readonly progress: number;
		readonly currentTime: number;
	};
}

export interface AnimationLoopedEvent extends AnimationEvent {
	readonly type: "AnimationLooped";
	readonly data: {
		readonly currentIteration: number;
		readonly totalIterations: number;
	};
}

// Event constructors
export const createAnimationStartedEvent = (
	animationId: string,
	duration: number,
	delay: number,
	timestamp: number,
): AnimationStartedEvent => ({
	type: "AnimationStarted",
	animationId,
	timestamp,
	data: { duration, delay },
});

export const createAnimationPausedEvent = (
	animationId: string,
	progress: number,
	currentTime: number,
	timestamp: number,
): AnimationPausedEvent => ({
	type: "AnimationPaused",
	animationId,
	timestamp,
	data: { progress, currentTime },
});

export const createAnimationResumedEvent = (
	animationId: string,
	progress: number,
	currentTime: number,
	timestamp: number,
): AnimationResumedEvent => ({
	type: "AnimationResumed",
	animationId,
	timestamp,
	data: { progress, currentTime },
});

export const createAnimationCompletedEvent = (
	animationId: string,
	duration: number,
	iterations: number,
	timestamp: number,
): AnimationCompletedEvent => ({
	type: "AnimationCompleted",
	animationId,
	timestamp,
	data: { duration, iterations },
});

export const createAnimationCancelledEvent = (
	animationId: string,
	progress: number,
	currentTime: number,
	timestamp: number,
): AnimationCancelledEvent => ({
	type: "AnimationCancelled",
	animationId,
	timestamp,
	data: { progress, currentTime },
});

export const createAnimationLoopedEvent = (
	animationId: string,
	currentIteration: number,
	totalIterations: number,
	timestamp: number,
): AnimationLoopedEvent => ({
	type: "AnimationLooped",
	animationId,
	timestamp,
	data: { currentIteration, totalIterations },
});
