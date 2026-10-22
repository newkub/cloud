/**
 * Timeline Domain Events - Event types for timeline lifecycle
 */

export type TimelineEventType =
	| "TimelineStarted"
	| "TimelinePaused"
	| "TimelineResumed"
	| "TimelineCompleted"
	| "TimelineCancelled"
	| "AnimationAdded"
	| "AnimationRemoved";

export interface TimelineEvent {
	readonly type: TimelineEventType;
	readonly timelineId: string;
	readonly timestamp: number;
	readonly data?: Record<string, unknown>;
}

export interface TimelineStartedEvent extends TimelineEvent {
	readonly type: "TimelineStarted";
	readonly data: {
		readonly totalDuration: number;
		readonly animationCount: number;
	};
}

export interface TimelinePausedEvent extends TimelineEvent {
	readonly type: "TimelinePaused";
	readonly data: {
		readonly progress: number;
		readonly currentTime: number;
	};
}

export interface TimelineResumedEvent extends TimelineEvent {
	readonly type: "TimelineResumed";
	readonly data: {
		readonly progress: number;
		readonly currentTime: number;
	};
}

export interface TimelineCompletedEvent extends TimelineEvent {
	readonly type: "TimelineCompleted";
	readonly data: {
		readonly totalDuration: number;
		readonly animationCount: number;
	};
}

export interface TimelineCancelledEvent extends TimelineEvent {
	readonly type: "TimelineCancelled";
	readonly data: {
		readonly progress: number;
		readonly currentTime: number;
	};
}

export interface AnimationAddedEvent extends TimelineEvent {
	readonly type: "AnimationAdded";
	readonly data: {
		readonly animationId: string;
		readonly offset: number;
	};
}

export interface AnimationRemovedEvent extends TimelineEvent {
	readonly type: "AnimationRemoved";
	readonly data: {
		readonly animationId: string;
	};
}

// Event constructors
export const createTimelineStartedEvent = (
	timelineId: string,
	totalDuration: number,
	animationCount: number,
	timestamp: number,
): TimelineStartedEvent => ({
	type: "TimelineStarted",
	timelineId,
	timestamp,
	data: { totalDuration, animationCount },
});

export const createTimelinePausedEvent = (
	timelineId: string,
	progress: number,
	currentTime: number,
	timestamp: number,
): TimelinePausedEvent => ({
	type: "TimelinePaused",
	timelineId,
	timestamp,
	data: { progress, currentTime },
});

export const createTimelineResumedEvent = (
	timelineId: string,
	progress: number,
	currentTime: number,
	timestamp: number,
): TimelineResumedEvent => ({
	type: "TimelineResumed",
	timelineId,
	timestamp,
	data: { progress, currentTime },
});

export const createTimelineCompletedEvent = (
	timelineId: string,
	totalDuration: number,
	animationCount: number,
	timestamp: number,
): TimelineCompletedEvent => ({
	type: "TimelineCompleted",
	timelineId,
	timestamp,
	data: { totalDuration, animationCount },
});

export const createTimelineCancelledEvent = (
	timelineId: string,
	progress: number,
	currentTime: number,
	timestamp: number,
): TimelineCancelledEvent => ({
	type: "TimelineCancelled",
	timelineId,
	timestamp,
	data: { progress, currentTime },
});

export const createAnimationAddedEvent = (
	timelineId: string,
	animationId: string,
	offset: number,
	timestamp: number,
): AnimationAddedEvent => ({
	type: "AnimationAdded",
	timelineId,
	timestamp,
	data: { animationId, offset },
});

export const createAnimationRemovedEvent = (
	timelineId: string,
	animationId: string,
	timestamp: number,
): AnimationRemovedEvent => ({
	type: "AnimationRemoved",
	timelineId,
	timestamp,
	data: { animationId },
});
